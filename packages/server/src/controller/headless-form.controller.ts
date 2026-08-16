import {
  Answer,
  CaptchaKindEnum,
  FieldKindEnum,
  FormField,
  HiddenField,
  HiddenFieldAnswer,
  SubmissionCategoryEnum,
  SubmissionStatusEnum
} from '@heyform-inc/shared-types-enums'
import {
  BadRequestException,
  Controller,
  NotFoundException,
  Options,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { AnyFilesInterceptor } from '@nestjs/platform-express'
import type { Request, Response } from 'express'

import {
  getMulterStorage,
  isUploadFileContentValid,
  normalizeCorsOrigin,
  saveUploadedFile,
  uploadFileFilter
} from '@config'
import { APP_HOMEPAGE_URL, UPLOAD_FILE_SIZE } from '@environments'
import { htmlUtils } from '@heyform-inc/answer-utils'
import { helper, nanoid, timestamp } from '@heyform-inc/utils'
import { FormModel } from '@model'
import {
  EndpointService,
  FormReportService,
  FormService,
  IntegrationService,
  SubmissionIpLimitService,
  SubmissionService
} from '@service'
import { ClientInfo, HttpClient, assertFormIsAcceptingSubmissions } from '@utils'

const SYSTEM_CONTROL_KEYS = new Set([
  '_next',
  '_redirect',
  '_gotcha',
  '_honeypot',
  '_bot',
  '_subject',
  '_replyto',
  '_email',
  '_captcha',
  'g-recaptcha-response',
  'cf-turnstile-response'
])

function isHiddenFieldKey(key: string): boolean {
  const lower = key.toLowerCase()
  return (
    lower.startsWith('utm_') ||
    lower.startsWith('affiliate') ||
    lower.startsWith('ref_') ||
    lower === 'referrer' ||
    lower === 'ref' ||
    lower === 'client_id' ||
    lower === 'session_id' ||
    (key.startsWith('_') && !SYSTEM_CONTROL_KEYS.has(key))
  )
}

function formatFieldTitle(key: string): string {
  return key
    .replace(/^_+/, '')
    .replace(/\[\]$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .trim()
}

function getFieldPlainTitle(field: FormField): string {
  if (typeof field.title === 'string') {
    return field.title
  }
  if (helper.isArray(field.title)) {
    return htmlUtils.plain(htmlUtils.serialize(field.title as any))
  }
  return field.label || ''
}

function inferFieldKind(key: string, value: any): FieldKindEnum {
  const lowerKey = key.toLowerCase()

  if (value && typeof value === 'object' && value.filename && value.url) {
    return FieldKindEnum.FILE_UPLOAD
  }

  if (lowerKey.includes('email') || (typeof value === 'string' && helper.isEmail(value))) {
    return FieldKindEnum.EMAIL
  }

  if (lowerKey.includes('phone') || lowerKey.includes('mobile') || lowerKey.includes('tel')) {
    return FieldKindEnum.PHONE_NUMBER
  }

  if (
    lowerKey.includes('url') ||
    lowerKey.includes('website') ||
    lowerKey.includes('link') ||
    (typeof value === 'string' && helper.isURL(value))
  ) {
    return FieldKindEnum.URL
  }

  if (
    lowerKey.includes('location') ||
    lowerKey.includes('address') ||
    lowerKey.includes('coordinates') ||
    (typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      ('latitude' in value || 'lat' in value || 'city' in value || 'address1' in value))
  ) {
    return FieldKindEnum.ADDRESS
  }

  if (
    Array.isArray(value) ||
    key.endsWith('[]') ||
    lowerKey.includes('interests') ||
    lowerKey.includes('tags') ||
    lowerKey.includes('categories')
  ) {
    return FieldKindEnum.MULTIPLE_CHOICE
  }

  if (
    typeof value === 'boolean' ||
    lowerKey.startsWith('is_') ||
    lowerKey.startsWith('has_') ||
    lowerKey.includes('agree') ||
    lowerKey.includes('subscribe') ||
    lowerKey.includes('opt_in')
  ) {
    return FieldKindEnum.YES_NO
  }

  if (
    typeof value === 'number' ||
    (!isNaN(Number(value)) &&
      typeof value === 'string' &&
      value.trim() !== '' &&
      (lowerKey.includes('amount') ||
        lowerKey.includes('budget') ||
        lowerKey.includes('price') ||
        lowerKey.includes('age') ||
        lowerKey.includes('count') ||
        lowerKey.includes('quantity')))
  ) {
    return FieldKindEnum.NUMBER
  }

  if (lowerKey.includes('date') || lowerKey.includes('birthday') || lowerKey.includes('deadline')) {
    return FieldKindEnum.DATE
  }

  if (
    (typeof value === 'string' && value.length > 100) ||
    lowerKey.includes('message') ||
    lowerKey.includes('comment') ||
    lowerKey.includes('description') ||
    lowerKey.includes('notes') ||
    lowerKey.includes('bio')
  ) {
    return FieldKindEnum.LONG_TEXT
  }

  return FieldKindEnum.SHORT_TEXT
}

function isJsonRequest(req: Request): boolean {
  const accept = req.headers.accept || ''
  const contentType = req.headers['content-type'] || ''
  return req.xhr || accept.includes('application/json') || contentType.includes('application/json')
}

function isValidRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch (_) {
    return false
  }
}

@Controller()
export class HeadlessFormController {
  constructor(
    private readonly formService: FormService,
    private readonly submissionService: SubmissionService,
    private readonly endpointService: EndpointService,
    private readonly submissionIpLimitService: SubmissionIpLimitService,
    private readonly formReportService: FormReportService,
    private readonly integrationService: IntegrationService
  ) {}

  private setCorsHeaders(form: FormModel | null, req: Request, res: Response): void {
    const requestOrigin = req.headers.origin as string | undefined
    const allowedDomains = (form?.settings as any)?.allowedDomains as string[] | undefined

    if (requestOrigin) {
      if (
        helper.isValidArray(allowedDomains) &&
        allowedDomains.length > 0 &&
        !allowedDomains.includes('*')
      ) {
        const originNormalized = normalizeCorsOrigin(requestOrigin)
        const isAllowed = allowedDomains.some(d => {
          const norm = normalizeCorsOrigin(d)
          return norm === originNormalized || d.trim() === requestOrigin
        })

        if (isAllowed) {
          res.setHeader('Access-Control-Allow-Origin', requestOrigin)
        }
      } else {
        res.setHeader('Access-Control-Allow-Origin', requestOrigin || '*')
      }
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*')
    }

    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, X-Requested-With, Authorization, x-anonymous-id, x-device-id'
    )
    res.setHeader('Access-Control-Max-Age', '86400')
  }

  @Options('/f/:formId')
  @Options('/api/f/:formId')
  async handleCorsPreflight(
    @Param('formId') formId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const form = await this.formService.findById(formId)
    this.setCorsHeaders(form, req, res)
    return res.status(204).end()
  }

  @Post('/f/:formId')
  @Post('/api/f/:formId')
  @UseInterceptors(
    AnyFilesInterceptor({
      limits: {
        fileSize: UPLOAD_FILE_SIZE
      },
      fileFilter: uploadFileFilter,
      storage: getMulterStorage()
    })
  )
  async submit(
    @Param('formId') formId: string,
    @HttpClient() client: ClientInfo,
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    const form = await this.formService.findById(formId)
    this.setCorsHeaders(form, req, res)

    const isJson = isJsonRequest(req)

    if (!form) {
      if (isJson) {
        return res.status(404).json({ success: false, error: 'The form does not exist' })
      }
      throw new NotFoundException('The form does not exist')
    }

    if (form.suspended) {
      if (isJson) {
        return res.status(403).json({ success: false, error: 'The form is suspended' })
      }
      throw new BadRequestException('The form is suspended')
    }

    if (form.settings?.active !== true) {
      if (isJson) {
        return res.status(400).json({ success: false, error: 'The form is not active' })
      }
      throw new BadRequestException('The form is not active')
    }

    const now = timestamp()
    try {
      assertFormIsAcceptingSubmissions(form.settings, now)
    } catch (err) {
      if (isJson) {
        return res.status(400).json({ success: false, error: err.message })
      }
      throw err
    }

    // IP Rate Limit check
    if (
      form.settings?.enableIpLimit &&
      helper.isValid(form.settings.ipLimitCount) &&
      form.settings.ipLimitCount > 0
    ) {
      try {
        await this.submissionIpLimitService.checkIp(form, client.ip)
      } catch (err) {
        if (isJson) {
          return res.status(429).json({ success: false, error: err.message || 'IP limit reached' })
        }
        throw err
      }
    }

    // Merge request body and uploaded files
    const rawBody: Record<string, any> = { ...(req.body || {}) }

    // Process file uploads
    if (helper.isValidArray(files) && files.length > 0) {
      for (const file of files) {
        if (isUploadFileContentValid(file)) {
          const savedFile = await saveUploadedFile(file)
          let fileUrl: string =
            APP_HOMEPAGE_URL.replace(/\/+$/, '') +
            `/static/upload/${encodeURIComponent(savedFile.filename)}`

          if (savedFile.location) {
            fileUrl = savedFile.location
          }

          const fileValue = {
            filename: savedFile.originalname,
            size: savedFile.size,
            url: fileUrl
          }

          const fieldname = file.fieldname || 'file'
          if (rawBody[fieldname]) {
            if (Array.isArray(rawBody[fieldname])) {
              rawBody[fieldname].push(fileValue)
            } else {
              rawBody[fieldname] = [rawBody[fieldname], fileValue]
            }
          } else {
            rawBody[fieldname] = fileValue
          }
        }
      }
    }

    // Anti-Spam Check 1: Honeypot
    let category = SubmissionCategoryEnum.INBOX
    const honeypotVal = rawBody._gotcha || rawBody._honeypot || rawBody._bot || rawBody['']
    if (helper.isValid(honeypotVal) && String(honeypotVal).trim() !== '') {
      category = SubmissionCategoryEnum.SPAM
    }

    // reCAPTCHA verification if enabled
    if (form.settings?.captchaKind === CaptchaKindEnum.GOOGLE_RECAPTCHA) {
      const captchaToken = rawBody['g-recaptcha-response'] || rawBody._captcha || rawBody.recaptcha
      if (!captchaToken) {
        if (isJson) {
          return res.status(400).json({ success: false, error: 'Captcha token is required' })
        }
        throw new BadRequestException('Captcha token is required')
      }
      await this.endpointService.antiBotCheck(CaptchaKindEnum.GOOGLE_RECAPTCHA, {
        captchaToken
      } as any)
    }

    // Process Answers & Hidden Fields
    const answers: Answer[] = []
    const hiddenFields: HiddenFieldAnswer[] = []
    const formFields = [...(form.fields || [])]
    const formHiddenFields = [...(form.hiddenFields || [])]
    const newFormFields: FormField[] = []
    const newHiddenFields: HiddenField[] = []

    for (const [key, value] of Object.entries(rawBody)) {
      if (SYSTEM_CONTROL_KEYS.has(key)) {
        continue
      }

      if (isHiddenFieldKey(key)) {
        hiddenFields.push({
          id: key,
          name: key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value ?? '')
        })

        if (!formHiddenFields.some(h => h.id === key || h.name === key)) {
          const newHf: HiddenField = { id: key, name: key }
          newHiddenFields.push(newHf)
          formHiddenFields.push(newHf)
        }
        continue
      }

      // Check if matching field already exists in form.fields
      let existingField = formFields.find(
        f =>
          f.id === key ||
          (f.label && f.label.toLowerCase().trim() === key.toLowerCase().trim()) ||
          getFieldPlainTitle(f).toLowerCase().trim() === key.toLowerCase().trim()
      )

      if (!existingField) {
        const fieldKind = inferFieldKind(key, value)
        const fieldTitle = formatFieldTitle(key)
        const fieldId = nanoid(8)

        existingField = {
          id: fieldId,
          title: fieldTitle,
          label: fieldTitle,
          kind: fieldKind
        }

        newFormFields.push(existingField)
        formFields.push(existingField)
      }

      answers.push({
        id: existingField.id,
        title:
          typeof existingField.title === 'string'
            ? existingField.title
            : getFieldPlainTitle(existingField) || formatFieldTitle(key),
        kind: existingField.kind,
        properties: existingField.properties || {},
        value
      })
    }

    // If new dynamic fields or hidden fields were discovered, update form schema
    const updatePayload: Record<string, any> = {
      fieldsUpdatedAt: now
    }
    let shouldUpdateForm = false

    if (newFormFields.length > 0 && (form.settings as any)?.autoCreateFields !== false) {
      updatePayload.fields = formFields
      updatePayload._drafts = JSON.stringify(formFields)
      shouldUpdateForm = true
    }

    if (newHiddenFields.length > 0) {
      updatePayload.hiddenFields = formHiddenFields
      shouldUpdateForm = true
    }

    if (shouldUpdateForm) {
      await this.formService.update(form.id, updatePayload)
    }

    // Akismet spam check if enabled
    if (form.settings?.filterSpam && category !== SubmissionCategoryEnum.SPAM) {
      const isSpam = await this.endpointService.verifySpam({
        answers,
        ip: client.ip
      })
      if (isSpam) {
        category = SubmissionCategoryEnum.SPAM
      }
    }

    let status = SubmissionStatusEnum.PUBLIC
    if (!form.settings?.allowArchive) {
      status = SubmissionStatusEnum.PRIVATE
    }

    const quotaLimit =
      form.settings?.enableQuotaLimit &&
      helper.isValid(form.settings.quotaLimit) &&
      form.settings.quotaLimit! > 0
        ? form.settings.quotaLimit
        : undefined

    const submissionId = await this.submissionService.createWithinQuota(
      {
        teamId: form.teamId,
        formId: form.id,
        category,
        title: form.name,
        answers,
        hiddenFields,
        startAt: now,
        endAt: now,
        ip: client.ip,
        userAgent: client.userAgent,
        status
      },
      quotaLimit
    )

    // Form report Queue
    this.formReportService.addQueue(form.id)

    // Integration Queue (Email notifications, Webhooks, Zapier, Slack, etc.)
    this.integrationService.addQueue(form, submissionId)

    // Response formatting
    if (isJson) {
      return res.status(200).json({
        success: true,
        submissionId,
        message: 'Submission received successfully'
      })
    }

    // HTML Form Redirection
    const redirectUrl =
      rawBody._next ||
      rawBody._redirect ||
      (form.settings as any)?.defaultRedirectUrl ||
      form.settings?.redirectUrl

    if (helper.isValid(redirectUrl) && isValidRedirectUrl(redirectUrl)) {
      return res.redirect(302, redirectUrl)
    }

    return res.render('form-submitted', {
      message: 'Your response has been recorded.',
      backUrl: req.get('referer') || undefined
    })
  }
}
