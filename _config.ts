import lume from "lume/mod.ts";

import Skiki from "npm:markdown-it-shiki";

import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import minifyHTML from "lume/plugins/minify_html.ts";

import TailwindConfig from "./tailwind.config.ts";
import env from "./src/env.ts";

const site = lume({
  src: "./src",
  dest: "./_site",
  location: new URL(env.SITE_URL),
  includes: "_includes",
  watcher: {
    ignore: [
      "_site/**/*",
    ],
  },
}, {
  yaml: {
    pageSubExtension: ".page",
  },
  markdown: {
    plugins: [
      [
        Skiki,
        {
          theme: {
            dark: "github-dark",
            light: "github-light",
          },
        },
      ],
    ],
    useDefaultPlugins: true,
  },
});

site
  .copy([".yaml"])
  .copyRemainingFiles((path) => Boolean(path.match(/\/posts\//)))
  .use(tailwindcss({
    extensions: [".html", ".md", ".vto"],
    options: TailwindConfig,
  }))
  .use(postcss())
  .use(resolveUrls())
  .use(minifyHTML());

export default site;
