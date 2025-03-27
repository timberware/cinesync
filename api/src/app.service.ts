import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private oct: Octokit;
  private GITHUB_TOKEN: string | undefined;

  constructor(private configService: ConfigService) {
    this.GITHUB_TOKEN = this.configService.get<string>('GITHUB_TOKEN');

    if (!this.GITHUB_TOKEN)
      throw new InternalServerErrorException('Env var GITHUB_TOKEN is missing');

    this.oct = new Octokit({ auth: this.GITHUB_TOKEN });
  }

  async getVersion() {
    const { data } = await this.oct.rest.repos.listTags({
      owner: 'timberware',
      repo: 'cinesync',
    });

    const webTags = data.filter((tag) => tag.name.includes('web'));

    return {
      tag: webTags.length ? webTags[0].name.replace('web-', '') : ':(',
    };
  }
}
