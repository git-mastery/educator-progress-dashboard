import dsv from "@rollup/plugin-dsv";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/educator-progress-dashboard/",
  plugins: [react(), tsconfigPaths(), tailwindcss(), dsv()],
});
