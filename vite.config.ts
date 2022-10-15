import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
	plugins: [
		solidPlugin({
			hot: false,
		}),
	],
	server: {
		port: 5050,
	},
	build: {
		target: "esnext",
	},
})
