import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // تجاوز لملف isVirtualEvent.ts لإصلاح تحذير mozInputSource
      "@react-aria/utils/src/isVirtualEvent": path.resolve(__dirname, "./src/utils/isVirtualEvent.ts"),
    },
  },
}));
