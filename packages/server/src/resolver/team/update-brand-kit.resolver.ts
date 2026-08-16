import { Auth, TeamGuard } from '@decorator'
import { UpdateBrandKitInput } from '@graphql'
import { pickObject } from '@kyndform/utils'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { BrandKitService } from '@service'

@Resolver()
@Auth()
export class UpdateBrandKitResolver {
  constructor(private readonly brandKitService: BrandKitService) {}

  @Mutation(returns => Boolean)
  @TeamGuard()
  async updateBrandKit(@Args('input') input: UpdateBrandKitInput): Promise<boolean> {
    return this.brandKitService.update(input.teamId, pickObject(input, [], ['teamId']))
  }
}
