import { type ToastType } from '../../ambient.d';

export const conflictError: ToastType = {
  message: 'email or username already exist',
  type: 'error',
  dismissible: true,
  timeout: 3000
};
