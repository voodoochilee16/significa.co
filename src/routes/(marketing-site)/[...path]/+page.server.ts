import { error } from '@sveltejs/kit';
import { PREVIEW_COOKIE_KEY } from '$lib/constants';
import { fetchPage } from '$lib/content';
import { BYPASS_TOKEN } from '$env/static/private';

export const load = async ({ params, cookies, fetch, url }) => {
  // don't catch paths that end with an extension
  if (/\..+$/.test(params.path)) throw error(404);

  try {
    const page = await fetchPage({
      slug: params.path,
      version: cookies.get(PREVIEW_COOKIE_KEY) ? 'draft' : 'published',
      fetch,
      url
    });

    return { page };
  } catch (err) {
    console.error('Failed to get storyblok page:', params.path, err);
    throw error(404, 'Not found');
  }
};

export const config = {
  isr: {
    // Expiration time (in seconds) before the cached asset will be re-generated by invoking the Serverless Function.
    // Setting the value to `false` means it will never expire.
    expiration: 60,

    // Random token that can be provided in the URL to bypass the cached version of the asset, by requesting the asset
    // with a __prerender_bypass=<token> cookie.
    //
    // Making a `GET` or `HEAD` request with `x-prerender-revalidate: <token>` will force the asset to be re-validated.
    bypassToken: BYPASS_TOKEN,

    // List of valid query parameters. Other parameters (such as utm tracking codes) will be ignored,
    // ensuring that they do not result in content being regenerated unnecessarily
    allowQuery: ['t', 'drawer']
  }
};
