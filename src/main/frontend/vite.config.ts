import {reactRouter} from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()], build: {
        sourcemap: true,
    }, server: {
        proxy: {
            // String shorthand:
            // Requests to http://localhost:5173/api/foo -> http://localhost:8080/api/foo
            "/api": {
                target: "http://localhost:8080", changeOrigin: true, secure: false
            },
        },
    },
});
