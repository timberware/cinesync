import { type ToastType } from '../../ambient.d';

export const error: ToastType = {
  message: 'incorrect email or password',
  type: 'error',
  dismissible: true,
  timeout: 3000
};
