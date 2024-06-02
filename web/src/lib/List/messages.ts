import { type ToastType } from '../../ambient.d';

const messageCommonProps = {
  dismissible: true,
  timeout: 3000
};

export const updatedError: ToastType = {
  message: 'There was an error updating the list',
  type: 'error',
  ...messageCommonProps
};

export const updatedSuccess: ToastType = {
  message: 'List successfully updated',
  type: 'success',
  ...messageCommonProps
};

export const deletedError: ToastType = {
  message: 'There was an error deleting the list',
  type: 'error',
  ...messageCommonProps
};

export const deletedSuccess: ToastType = {
  message: 'List successfully deleted',
  type: 'success',
  ...messageCommonProps
};

export const clonedError: ToastType = {
  message: 'There was an error cloning the list',
  type: 'error',
  ...messageCommonProps
};

export const clonedSuccess: ToastType = {
  message: 'List successfully cloned',
  type: 'success',
  ...messageCommonProps
};
