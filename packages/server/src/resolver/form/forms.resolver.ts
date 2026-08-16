import { Auth, ProjectGuard } from '@decorator'
import { FormType, FormsInput } from '@graphql'
import { date, helper } from '@kyndform/utils'
import { FormModel } from '@model'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { FormService, SubmissionService } from '@service'

const DEFAULT_FORM_NAME = 'Untitled'

@Resolver()
@Auth()
export class FormsResolver {
  constructor(
    private readonly formService: FormService,
    private readonly submissionService: SubmissionService
  ) {}

  @Query(returns => [FormType])
  @ProjectGuard()
  async forms(@Args('input') input: FormsInput): Promise<FormModel[]> {
    const forms = await this.formService.findAll(input.projectId, input.status, input.keyword)

    if (helper.isEmpty(forms)) {
      return []
    }

    const countMap = await this.submissionService.countInForms(forms.map(form => form.id))

    return forms.map(form => {
      //@ts-ignore
      form.updatedAt = date(form.get('updatedAt')).unix()

      //@ts-ignore
      form.submissionCount = countMap.find(row => row._id === form.id)?.count ?? 0

      if (helper.isEmpty(form.name)) {
        form.name = DEFAULT_FORM_NAME
      }

      return form
    })
  }
}
