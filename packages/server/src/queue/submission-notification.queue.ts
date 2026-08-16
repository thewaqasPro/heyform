import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'

import { APP_HOMEPAGE_URL } from '@environments'
import { answersToHtml } from '@heyform-inc/answer-utils'
import { date } from '@heyform-inc/utils'
import { FormService, MailService, SubmissionService, TeamService, UserService } from '@service'

import { BaseQueue, IntegrationQueueJob } from './base.queue'

@Processor('SubmissionNotificationQueue')
export class SubmissionNotificationQueue extends BaseQueue {
  constructor(
    private readonly submissionService: SubmissionService,
    private readonly mailService: MailService,
    private readonly formService: FormService,
    private readonly userService: UserService,
    private readonly teamService: TeamService
  ) {
    super()
  }

  @Process()
  async process(job: Job<IntegrationQueueJob>): Promise<any> {
    const [submission, form] = await Promise.all([
      this.submissionService.findById(job.data.submissionId),
      this.formService.findById(job.data.formId)
    ])

    if (!submission || !form) {
      return
    }

    const [user, team] = await Promise.all([
      this.userService.findById(form.memberId),
      this.teamService.findById(form.teamId)
    ])

    if (!user) {
      return
    }

    const logo = form.themeSettings?.logo || team?.avatar || ''
    const workspaceName = team?.name || form.name || 'HeyForm'
    const submissionDate = date(submission.startAt ? submission.startAt * 1000 : Date.now()).format(
      'MMMM D, YYYY · h:mm A'
    )
    const html = answersToHtml(submission.answers || [])

    await this.mailService.submissionNotification(
      user.email,
      {
        formName: form.name,
        submission: html,
        link: `${APP_HOMEPAGE_URL}/workspace/${form.teamId}/project/${form.projectId}/form/${form.id}/submissions`,
        logo,
        workspaceName,
        submissionDate,
        submissionId: submission.id
      },
      user.lang
    )
  }
}
