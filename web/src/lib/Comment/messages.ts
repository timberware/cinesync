import { type ToastType } from '../../ambient.d';

const messageCommonProps = {
  dismissible: true,
  timeout: 3000
};

export const error: ToastType = {
  message: 'There was an error submitting your comment',
  type: 'error',
  ...messageCommonProps
};

export const success: ToastType = {
  message: 'Comment successfully updated',
  type: 'success',
  ...messageCommonProps
};
