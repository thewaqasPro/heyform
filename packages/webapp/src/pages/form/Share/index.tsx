import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandX,
  IconCode,
  IconExclamationCircle,
  IconMail,
  IconQrcode,
  IconTerminal2
} from '@tabler/icons-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { getDecoratedURL, useParam } from '@/utils'

import { Button, Tooltip } from '@/components'
import { FORM_EMBED_OPTIONS } from '@/consts'
import { useAppStore, useFormStore, useWorkspaceStore } from '@/store'

import EmbedModal from './EmbedModal'
import HeadlessModal from './HeadlessModal'
import LinkSettings from './LinkSettings'
import QRCodeModal from './QRCodeModal'

export default function FormShare() {
  const { t } = useTranslation()

  const { formId } = useParam()
  const { openModal } = useAppStore()
  const { sharingURLPrefix } = useWorkspaceStore()
  const { form, selectEmbedType } = useFormStore()

  const shareLink = useMemo(() => sharingURLPrefix + '/form/' + formId, [formId, sharingURLPrefix])

  function handleShareEmail() {
    const url = getDecoratedURL('mailto:', {
      subject: 'Cold you take a moment to fill in this heyform?',
      body: `We would really appreciate it if you filled in this form: ${shareLink}. Thank you.`
    })
    window.open(url)
  }

  function handleShareFacebook() {
    const url = getDecoratedURL('https://www.facebook.com/sharer/sharer.php', {
      u: shareLink
    })
    window.open(url)
  }

  function handleShareLinkedin() {
    const url = getDecoratedURL('https://www.linkedin.com/sharing/share-offsite', {
      url: shareLink
    })
    window.open(url)
  }

  function handleShareTwitter() {
    const url = getDecoratedURL('https://twitter.com/share', {
      url: shareLink,
      title: form?.name || ''
    })
    window.open(url)
  }

  function handleShareQrcode() {
    openModal('QRCodeModal', {
      url: shareLink
    })
  }

  function handleOpenEmbed(embedType: string) {
    selectEmbedType(embedType)
    openModal('EmbedModal')
  }

  return (
    <>
      <div className="mt-10 space-y-10 px-6">
        {form?.canPublish && (
          <div className="border-accent-light flex items-center justify-center gap-x-2 rounded-lg border bg-red-50 py-2">
            <IconExclamationCircle className="h-5 w-5 text-red-700" />
            <span className="text-sm/6 font-medium text-red-700">
              {t('form.share.unpublishedTip')}
            </span>
          </div>
        )}

        <section id="link">
          <h2 className="hf-section-title">{t('form.share.link.headline')}</h2>
          <div className="mt-4">
            <div className="flex flex-col gap-2 text-sm/6 sm:flex-row sm:items-center">
              <div className="hf-card border-input flex items-center gap-x-4 rounded-lg border">
                <div className="h-10 flex-1 truncate pl-4 leading-10">{shareLink}</div>
                <Button.Copy className="rounded-l-none" text={shareLink} />
              </div>
            </div>

            <div className="mt-2 flex items-center gap-x-2">
              <Tooltip label={t('form.share.link.viaX')}>
                <div>
                  <Button.Link size="md" iconOnly onClick={handleShareTwitter}>
                    <IconBrandX className="h-5 w-5" />
                  </Button.Link>
                </div>
              </Tooltip>

              <Tooltip label={t('form.share.link.viaFacebook')}>
                <div>
                  <Button.Link size="md" iconOnly onClick={handleShareFacebook}>
                    <IconBrandFacebook className="h-5 w-5" />
                  </Button.Link>
                </div>
              </Tooltip>

              <Tooltip label={t('form.share.link.viaLinkedIn')}>
                <div>
                  <Button.Link size="md" iconOnly onClick={handleShareLinkedin}>
                    <IconBrandLinkedin className="h-5 w-5" />
                  </Button.Link>
                </div>
              </Tooltip>

              <Tooltip label={t('form.share.link.email.title')}>
                <div>
                  <Button.Link size="md" iconOnly onClick={handleShareEmail}>
                    <IconMail className="h-5 w-5" />
                  </Button.Link>
                </div>
              </Tooltip>

              <Tooltip label={t('form.share.link.qrcode.title')}>
                <div>
                  <Button.Link size="md" iconOnly onClick={handleShareQrcode}>
                    <IconQrcode className="h-5 w-5" />
                  </Button.Link>
                </div>
              </Tooltip>
            </div>
          </div>
        </section>

        <LinkSettings />

        <section id="headless">
          <h2 className="hf-section-title">Headless & Static Form Endpoint</h2>
          <p className="text-secondary text-sm/6">
            Connect your Next.js, Astro.js, or static HTML form directly via a simple POST method
            URL.
          </p>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <div className="hf-card border-input flex flex-1 items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary-light/30 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                  <IconTerminal2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-primary text-sm font-semibold">
                    HTML Form Action & API POST
                  </div>
                  <div className="text-secondary font-mono text-xs">
                    {sharingURLPrefix}/f/{formId}
                  </div>
                </div>
              </div>
              <Button size="sm" onClick={() => openModal('HeadlessModal')}>
                <IconCode className="h-4 w-4" />
                <span>Integration Snippets</span>
              </Button>
            </div>
          </div>
        </section>

        <section id="embed">
          <h2 className="hf-section-title">{t('form.share.embed.headline')}</h2>
          <p className="text-secondary text-sm/6">{t('form.share.embed.subHeadline')}</p>

          <div className="mt-4 flex gap-4 sm:gap-8">
            {FORM_EMBED_OPTIONS.map(row => (
              <button
                key={row.value}
                type="button"
                tabIndex={-1}
                className="text-secondary hover:text-primary w-32 text-sm/6"
                onClick={() => handleOpenEmbed(row.value)}
              >
                <div className="border-input rounded-md border">
                  <row.icon className="w-full rounded-md" />
                </div>
                <div className="mt-1.5 text-center">{t(row.label)}</div>
              </button>
            ))}
          </div>
        </section>
      </div>

      <QRCodeModal />
      <EmbedModal />
      <HeadlessModal />
    </>
  )
}
