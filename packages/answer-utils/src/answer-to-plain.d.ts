import { Answer } from '@heyform-inc/shared-types-enums'

export declare function answersToPlain(answers: Answer[]): string
export declare function parsePlainAnswer(answer: Answer, livePreview?: boolean): string
