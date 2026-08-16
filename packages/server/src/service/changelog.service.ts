import { Injectable } from '@nestjs/common'
import got from 'got'

interface GitHubRelease {
  id: number
  tag_name: string
  name: string
  body: string
  html_url: string
  published_at: string
}

const GITHUB_API_URL = 'https://api.github.com/repos/kyndform/kyndform/releases'

@Injectable()
export class ChangelogService {
  async getLatestRelease() {
    const result = await got
      .get(`${GITHUB_API_URL}/latest`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Kyndform-Changelog'
        }
      })
      .json<GitHubRelease>()

    return {
      id: result.id,
      publishedAt: result.published_at
    }
  }

  async getAllReleases() {
    const result = await got
      .get(GITHUB_API_URL, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Kyndform-Changelog'
        }
      })
      .json<GitHubRelease[]>()

    return result.map(r => ({
      id: r.id,
      title: r.name || r.tag_name,
      content: r.body || '',
      publishedAt: r.published_at
    }))
  }
}
