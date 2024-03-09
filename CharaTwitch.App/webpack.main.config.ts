import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

export const mainConfig: Configuration = {
	/**
	 * This is the main entry point for your application, it's the first file
	 * that runs in the main process.
	 */
	entry: "./src/index.ts",
	externals: {
		puppeteer: "puppeteer",
		"puppeteer-extra": "puppeteer-extra",
		"puppeteer-extra-plugin-stealth": "puppeteer-extra-plugin-stealth",
		"@puppeteer/browsers": "@puppeteer/browsers",
	},
	// Put your normal webpack config below here
	module: {
		rules,
	},
	plugins,
	resolve: {
		extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
	},
};
