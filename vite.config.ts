import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => ({
	plugins: [react()],
	build: {
		outDir: "dist",
		emptyOutDir: true,
		sourcemap: mode == "development",
		target: "es2015",
		minify: "esbuild",
		cssCodeSplit: true,
		chunkSizeWarningLimit: 500,
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes("node_modules")) {
						return "vendor";
					}
				},
				chunkFileNames: "js/[name]-[hash].js",
				entryFileNames: "js/[name]-[hash].js",
			},
		},
	},

	resolve: {
		alias: {
			"@app": path.resolve(__dirname, "src/app"),
		},
	},
}));
