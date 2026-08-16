import * as assert from 'assert'

import { MailService } from '../src/service/mail.service'

interface QueuedMail {
  data: {
    data: {
      html: string
      subject: string
    }
  }
}

async function testEscapesTemplateReplacementsAndPreservesSafeSubmissionHtml() {
  let queued: QueuedMail | undefined
  const queue = {
    add: async (data: QueuedMail['data']) => {
      queued = { data }
    }
  }
  const service = new MailService(queue as any)

  await service.submissionNotification('owner@example.test', {
    formName: '<img src=x onerror=alert(1)>\r\nBcc: attacker@example.test',
    submission: `
      <ol>
        <li><h3>Safe title</h3><p>Safe answer</p></li>
      </ol>
      <img src=x onerror=alert(1)>
      <script>alert(1)</script>
    `,
    link: 'https://kyndform.example/forms/a?x=1&y="bad"'
  })

  assert.ok(queued)
  assert.ok(queued!.data.data.subject.includes('<img src=x onerror=alert(1)>'))
  assert.ok(!queued!.data.data.subject.includes('\r'))
  assert.ok(!queued!.data.data.subject.includes('\n'))
  assert.ok(queued!.data.data.html.includes('<ol>'))
  assert.ok(queued!.data.data.html.includes('<h3>Safe title</h3>'))
  assert.ok(!queued!.data.data.html.includes('<img'))
  assert.ok(!queued!.data.data.html.includes('<script'))
  assert.ok(
    queued!.data.data.html.includes('href="https://kyndform.example/forms/a?x=1&amp;y=%22bad%22"')
  )

  await service.teamInvitation('member@example.test', {
    userName: '<img src=x onerror=alert(1)>',
    teamName: '<style>body{display:none}</style>',
    link: 'https://kyndform.example/invite?x=1&y="bad"'
  })

  assert.ok(queued!.data.data.html.includes('&lt;img src=x onerror=alert(1)&gt;'))
  assert.ok(queued!.data.data.html.includes('&lt;style&gt;body{display:none}&lt;/style&gt;'))
  assert.ok(!queued!.data.data.html.includes('<img'))
  assert.ok(!queued!.data.data.html.includes('<style>'))

  await service.teamInvitation('member@example.test', {
    userName: 'User',
    teamName: 'Team',
    link: 'javascript:alert(1)'
  })

  assert.ok(queued!.data.data.html.includes('href="#"'))
  assert.ok(!queued!.data.data.html.includes('javascript:'))
}

async function run() {
  await testEscapesTemplateReplacementsAndPreservesSafeSubmissionHtml()
}

if (require.main === module) {
  run().catch(error => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exitCode = 1
  })
}
