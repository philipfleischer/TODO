// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  type Todo = {
    uid: string;
    created_at: string;
    text: string;
    done: boolean;
  };
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
