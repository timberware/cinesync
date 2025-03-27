import type { LayoutServerLoad } from './$types';
import { API } from '../utils';

export const load: LayoutServerLoad = async () => {
  const response = await fetch(`${API}/version`, {
    method: 'GET'
  });

  const r = await response.json();

  return { tag: r.tag };
};
