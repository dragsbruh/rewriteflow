import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "bulma/sass/utilities/initial-variables.scss";
          @import "bulma/sass/utilities/functions.scss";
        `,
      },
    },
  },
});
