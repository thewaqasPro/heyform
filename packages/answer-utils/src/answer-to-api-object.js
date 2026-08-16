'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.answersToApiObject = void 0
const answer_to_plain_1 = require('./answer-to-plain')
function answersToApiObject(answers) {
  const result = {}
  answers.forEach(answer => {
    const key = `(ID: ${answer.id}) ${answer.title}`
    result[key] = (0, answer_to_plain_1.parsePlainAnswer)(answer)
  })
  return result
}
exports.answersToApiObject = answersToApiObject
//# sourceMappingURL=answer-to-api-object.js.map
