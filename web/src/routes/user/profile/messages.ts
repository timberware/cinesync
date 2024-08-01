import { type ToastType } from '../../../ambient.d';

const messageCommonProps = {
  dismissible: true,
  timeout: 3000
};

export const error: ToastType = {
  message: 'There was an error updating your avatar',
  type: 'error',
  ...messageCommonProps
};

export const success: ToastType = {
  message: 'Avatar updated',
  type: 'success',
  ...messageCommonProps
};
