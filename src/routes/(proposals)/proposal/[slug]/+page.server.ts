import { STORYBLOK_PROPOSALS_TOKEN } from '$env/static/private';
import { PREVIEW_COOKIE_KEY } from '$lib/constants';
import { getStoryblok } from '$lib/storyblok';
import { fetchPage } from '$lib/content';
import type { ProposalStoryblok } from '$types/bloks.js';
import type { ISbStoryData } from '@storyblok/js';

const getCookieName = (slug: string) => `PROPOSAL_TOKEN_${slug}`;

const isStatusError = (err: unknown): err is { status: number } => {
  return (
    typeof err === 'object' && err !== null && 'status' in err && typeof err.status === 'number'
  );
};

export const load = async ({ cookies, fetch, params, url }) => {
  const version: 'draft' | 'published' = cookies.get(PREVIEW_COOKIE_KEY) ? 'draft' : 'published';
  const storyblok = getStoryblok({ fetch }, { accessToken: STORYBLOK_PROPOSALS_TOKEN });

  const password = cookies.get(getCookieName(params.slug));

  const failAuthentication = () => {
    cookies.delete(getCookieName(params.slug));
    return { error: true };
  };

  if (!password) {
    return {};
  }

  let res;
  let services;
  let home;

  try {
    res = await storyblok.get('cdn/stories/' + url.pathname, {
      version,
      resolve_relations: ['proposal-team-entry.department']
    });
  } catch (error) {
    if (isStatusError(error) && error.status === 404) {
      return failAuthentication();
    }

    throw error;
  }

  const story: ISbStoryData<ProposalStoryblok> = res.data.story;

  if (story.content.password !== password) {
    return failAuthentication();
  }

  try {
    services = await fetchPage({
      slug: 'services',
      version,
      fetch,
      url
    });
  } catch (err) {
    console.error('Fetching services for proposals: ' + err);
    throw err;
  }

  try {
    home = await fetchPage({
      slug: '',
      version,
      fetch,
      url
    });
  } catch (err) {
    console.error('Fetching home for proposals: ' + err);
    throw err;
  }

  return { story, services, home };
};

export const actions = {
  default: async ({ request, cookies, params }) => {
    const formData = await request.formData();
    const password = formData.get('password');

    if (password && typeof password === 'string') {
      cookies.set(getCookieName(params.slug), password);
    }

    return {};
  }
};
