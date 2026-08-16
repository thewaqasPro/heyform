import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { helper } from '@kyndform/utils'
import { TemplateModel } from '@model'
import { literalSearchRegex } from '@utils'

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(TemplateModel.name)
    private readonly templateModel: Model<TemplateModel>
  ) {}

  async findById(id: string): Promise<TemplateModel | null> {
    return this.templateModel.findById(id)
  }

  async findPublishedById(id: string): Promise<TemplateModel | null> {
    return this.templateModel.findOne({
      _id: id,
      published: true
    })
  }

  async findBySlug(slug: string): Promise<TemplateModel | null> {
    return this.templateModel.findOne({ slug })
  }

  async findAll(keyword?: string, limit?: number): Promise<TemplateModel[]> {
    const conditions: any = {
      published: true
    }

    if (keyword) {
      conditions.name = literalSearchRegex(keyword)
    }

    if (helper.isValid(limit) && limit! > 0) {
      return this.templateModel
        .find(conditions)
        .sort({
          usedCount: -1
        })
        .limit(limit!)
    }

    return this.templateModel.find(conditions).sort({
      _id: -1
    })
  }

  public async updateUsedCount(templateId: string): Promise<any> {
    return this.templateModel.updateOne(
      {
        _id: templateId
      },
      {
        $inc: {
          usedCount: 1
        }
      }
    )
  }
}
