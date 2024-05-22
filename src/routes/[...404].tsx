import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <main class="h-screen text-center mx-auto text-gray-700 p-4 flex items-center justify-center">
      <A href="/" class="max-6-xs text-8xl text-disabled uppercase my-16">404</A>
    </main>
  );
}
