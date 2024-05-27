import { type ToastType } from '../../ambient.d';

const messageCommonProps = {
  dismissible: true,
  timeout: 3000
};

export const watchedError: ToastType = {
  message: 'There was an error updating the movie',
  type: 'error',
  ...messageCommonProps
};

export const watchedSuccess: ToastType = {
  message: 'Movie successfully updated',
  type: 'success',
  ...messageCommonProps
};

export const deletedError: ToastType = {
  message: 'There was an error deleting the movie',
  type: 'error',
  ...messageCommonProps
};

export const deletedSuccess: ToastType = {
  message: 'Movie successfully deleted',
  type: 'success',
  ...messageCommonProps
};
