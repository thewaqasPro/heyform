import { Form, Input } from '@/components'
import { AppSettingType } from '@/types'

export default function IntegrationSettingsItem({ setting }: { setting: AppSettingType }) {
  switch (setting.type) {
    case 'url':
      return (
        <Form.Item
          name={setting.name}
          label={setting.label}
          footer={setting.description}
          rules={[
            {
              type: 'url',
              required: setting.required
            }
          ]}
        >
          <Input placeholder={setting.placeholder} />
        </Form.Item>
      )
    case 'text':
      return (
        <Form.Item
          name={setting.name}
          label={setting.label}
          footer={setting.description}
          rules={[{ required: setting.required }]}
        >
          <Input placeholder={setting.placeholder} />
        </Form.Item>
      )
    case 'textarea':
      return (
        <Form.Item
          name={setting.name}
          label={setting.label}
          footer={setting.description}
          rules={[{ required: setting.required }]}
        >
          <Input.TextArea rows={4} placeholder={setting.placeholder} />
        </Form.Item>
      )
    default:
      return (
        <Form.Item
          name={setting.name}
          label={setting.label}
          footer={setting.description}
          rules={[{ required: setting.required }]}
        >
          <Input placeholder={setting.placeholder} />
        </Form.Item>
      )
  }
}
