import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
// eslint-disable-next-line import/default
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const assets = ["images"];

export const plugins = [
	new ForkTsCheckerWebpackPlugin({
		logger: "webpack-infrastructure",
	}),
	new CopyWebpackPlugin({
		patterns: assets.map((asset) => ({
			from: path.resolve(__dirname, "src", asset),
			to: asset,
		})),
	}),
];
