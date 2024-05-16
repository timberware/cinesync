import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { type ToastType } from '../ambient.d';

export const toasts = writable<ToastType[]>([]);
const defaults = {
  type: 'info',
  dismissible: true,
  timeout: 3000
};

export const addToast = (toast: ToastType) => {
  const id = uuidv4();

  toasts.update(all => [{ ...defaults, id, ...toast }, ...all]);
  if (toast.timeout) {
    setTimeout(() => dismissToast(id), toast.timeout);
  }
};

export const dismissToast = (id: string) => {
  toasts.update(all => all.filter(t => t.id !== id));
};
