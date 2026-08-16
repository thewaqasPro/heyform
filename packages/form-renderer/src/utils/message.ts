export function sendMessageToParent(eventName: string) {
  window.parent?.postMessage(
    {
      source: 'KYNDFORM',
      eventName
    },
    '*'
  )
}
