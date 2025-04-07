import { type Config } from "npm:prettier";

export default {
  plugins: await Promise.all([
    import("npm:prettier-plugin-tailwindcss"),
    import("npm:prettier-plugin-jinja-template"),
  ]),
  overrides: [
    {
      files: "*.vto",
      options: {
        parser: "jinja-template",
      },
    },
  ],
} satisfies Config;
