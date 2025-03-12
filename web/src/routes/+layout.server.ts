import { Octokit } from 'octokit';
import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

const TOKEN = process.env.GITHUB_TOKEN || env.GITHUB_TOKEN;

const octokit = new Octokit({ auth: TOKEN });

export const load: LayoutServerLoad = async () => {
  const { data } = await octokit.rest.repos.listTags({
    owner: 'timberware',
    repo: 'cinesync'
  });

  const webTags = data.filter(t => t.name.includes('web'));

  return { tag: webTags?.[0].name.replace('web-', '') ?? 'unavailable' };
};
