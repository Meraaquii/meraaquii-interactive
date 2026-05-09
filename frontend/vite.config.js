import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // This matches your requirement for the /client path
  base: "/client/",
  build: {
    rollupOptions: {
      output: {
        // This splits your giant 534kB file into smaller pieces
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    // Increases limit slightly so the warning disappears
    chunkSizeWarningLimit: 600,
  },
});
