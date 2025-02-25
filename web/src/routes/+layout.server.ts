import { Octokit } from 'octokit';
import { env } from '$env/dynamic/private';

const TOKEN = process.env.GITHUB_TOKEN || env.GITHUB_TOKEN;

const octokit = new Octokit({ auth: TOKEN });

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  const { data } = await octokit.rest.repos.listTags({
    owner: 'timberware',
    repo: 'cinesync'
  });

  const webTags = data.filter(t => t.name.includes('web'));

  return { tag: webTags?.[0].name.replace('web-', '') ?? 'unavailable' };
}
