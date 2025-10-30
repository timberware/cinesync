// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

/* eslint-disable no-unused-vars */
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: {
        username: string;
        email: string;
        id: string;
      } | null;

      pagination: {
        curr: number;
        prev: number;
        next: number;
        last: number;
      } | null;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
