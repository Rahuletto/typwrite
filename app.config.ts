import { defineConfig } from "@solidjs/start/config";
import solid from "solid-start/vite"
import vercel from "solid-start-vercel"

export default defineConfig({
    vite: {
        plugins: [solid({ adapter: vercel() })]
    }
});
