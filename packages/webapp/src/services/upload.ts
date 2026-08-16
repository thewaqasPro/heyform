import { FileUploadValue } from '@heyform-inc/shared-types-enums'
import axios from 'axios'

import { getDeviceId } from '@/utils'

export interface UploadContext {
  fieldId: string
  formId: string
  openToken: string
}

export class UploadService {
  static async upload(file: File | Blob, context?: UploadContext): Promise<FileUploadValue> {
    const formData = new FormData()
    const filename =
      (file as any).name ||
      (typeof File !== 'undefined' && file instanceof File ? file.name : 'upload.png')
    formData.append('file', file, filename)

    const deviceId = getDeviceId()

    const result = await axios.post('/api/upload', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(deviceId ? { 'x-device-id': deviceId } : {}),
        ...(context
          ? {
              'x-heyform-field-id': context.fieldId,
              'x-heyform-form-id': context.formId,
              'x-heyform-open-token': context.openToken
            }
          : {})
      }
    })

    return result.data
  }
}
