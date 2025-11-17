import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const { user } = locals;

    if (!user) {
      return {};
    }
    return {
      user
    };
  } catch (e) {
    console.error(e);
  }
};
