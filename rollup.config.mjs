import { readFileSync } from "fs"; 
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import postcss from 'rollup-plugin-postcss'
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';

import dev from "rollup-plugin-dev";

const { name, description, version, config } = JSON.parse(
    readFileSync("./package.json", { endoding: "utf8" })
  );

const production = !process.env.ROLLUP_WATCH;
const dist = "public";
const port = 5000;

export default {
  input: "src/main.mjs",
  output: {
    sourcemap: true,
    format: "esm",
    file: `${dist}/bundle.mjs`,
    plugins: [production && terser()]
  },
  plugins: [
    postcss({
      extract: true,
      sourcemap: true,
      minimize: production,
      plugins: [postcssImport,tailwindcss]
    }),
    resolve({ browser: true }),
    commonjs(),
    dev({
      port,
      dirs: [dist],
      spa: `${dist}/index.html`,
      basePath: config.base,
      proxy: { [`${config.api}/*`]: [config.proxyTarget, { https: true }] }
    })
  ],
  watch: {
    clearScreen: false
  }
};
