import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import env from "./src/env.ts";

const site = lume({
  src: "./src",
  dest: "./_site",
  location: new URL(env.SITE_URL),
  includes: "_includes",
});
site
  .use(tailwindcss({
    extensions: [".html", ".md", ".jsx", ".tsx"],
    options: {},
  }))
  .use(postcss());

export default site;
