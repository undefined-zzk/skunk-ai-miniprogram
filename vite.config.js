import {
	defineConfig
} from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import path from 'path';
import AutoImport from "unplugin-auto-import/vite";
export default defineConfig({
	plugins: [
		uni(),
		AutoImport({
			include: [
				/\.vue$/,
				/\.vue\?vue/,
			],
			imports: ["vue", "uni-app"],
			dts: "typings/auto-imports.d.ts",
		}),
	],
});