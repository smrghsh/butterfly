import glsl from "vite-plugin-glsl";
import basicSsl from "@vitejs/plugin-basic-ssl";

const isCodeSandbox =
  "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env;

export default {
  root: "src/",
  publicDir: "../static/",
  base: "./",
  server: {
    host: true,
    open: !isCodeSandbox, // Open if it's not a CodeSandbox
    https: true,
  },
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
  },
  plugins: [glsl(), basicSsl()],
};
