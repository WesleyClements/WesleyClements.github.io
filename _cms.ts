import { extname } from "jsr:@std/path";
import { assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import lumeCMS from "lume/cms/mod.ts";
import env from "./src/env.ts";
import { capitalize, fileName } from "./src/util/strings.ts";

assertExists(env.PORT, "PORT is required");
assertExists(env.CMS_USERNAME, "CMS_USERNAME is required");
assertExists(env.CMS_PASSWORD, "CMS_PASSWORD is required");

const cms = lumeCMS({
  site: {
    name: "Personal Site",
    url: `${env.SITE_URL}:${env.PORT}`,
  },
});

cms.auth({
  [env.CMS_USERNAME]: env.CMS_PASSWORD,
});

export const Storage = {
  Files: "files",
} as const;

cms.storage(Storage.Files, "src");

export const Collection = {
  BlogPosts: "blog-posts",
  Projects: "projects",
} as const;

export const View = {
  Editor: "editor",
} as const;

const DRAFT_PREFIX = "draft";

cms.collection({
  name: Collection.BlogPosts,
  label: "Blog Posts",
  store: `${Storage.Files}:blog/posts/*.md`,
  views: [View.Editor],
  fields: [
    {
      name: "title",
      type: "text",
      attributes: {
        required: true,
      },
    },
    {
      name: "content",
      type: "markdown",
      attributes: {
        required: true,
      },
    },
    {
      name: "draft",
      type: "checkbox",
      label: "Draft",
      value: true,
      view: View.Editor,
    },
    {
      name: "date",
      type: "datetime",
    },
    {
      name: "tags",
      type: "list",
      init: (field, { data }) => {
        const site = data.site;
        const search = site.search.values("tags");
        const options = Array.isArray(search) ? search : [search];
        if (!options) {
          return;
        }
        if (Array.isArray(field.options)) {
          options.push(...field.options);
        }
        field.options = Array.from(new Set(options)).toSorted();
      },
    },
  ],
  documentName: (doc): string =>
    fileName`${doc.draft ? DRAFT_PREFIX + "-" : ""}${doc.title}.md`,
  documentLabel: (file): string => {
    const fileName = file.replace(new RegExp(`${extname(file)}$`), "");
    const [preface, firstWord, ...rest] = fileName.split("-");
    if (preface === DRAFT_PREFIX) {
      return `(Draft) ${[capitalize(firstWord), ...rest].join(" ")}`;
    } else {
      return [capitalize(preface), firstWord, ...rest].join(" ");
    }
  },
});

cms.collection({
  name: Collection.Projects,
  store: `${Storage.Files}:projects/*.md`,
  views: [View.Editor],
  fields: [
    {
      name: "name",
      type: "text",
      attributes: {
        required: true,
      },
    },
    {
      name: "content",
      type: "markdown",
      attributes: {
        required: true,
      },
    },
    {
      name: "draft",
      type: "checkbox",
      label: "Draft",
      value: true,
      view: View.Editor,
    },
  ],
  documentName: "{name}.md",
});

export const Upload = {
  Images: "images",
} as const;

cms.upload({
  name: Upload.Images,
  store: `${Storage.Files}:images`,
  listed: false,
});

export default cms;
