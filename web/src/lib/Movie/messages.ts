import { type ToastType } from '../../ambient.d';

export const watchedError: ToastType = {
  message: 'There was an error updating the movie',
  type: 'error',
  dismissible: true,
  timeout: 3000
};

export const watchedSuccess: ToastType = {
  message: 'Movie successfully updated',
  type: 'success',
  dismissible: true,
  timeout: 3000
};

export const deletedError: ToastType = {
  message: 'There was an error deleting the movie',
  type: 'error',
  dismissible: true,
  timeout: 3000
};

export const deletedSuccess: ToastType = {
  message: 'Movie successfully deleted',
  type: 'success',
  dismissible: true,
  timeout: 3000
};
