// source.config.ts
import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod/v4";
var docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      // Groups the page on /components, e.g. "Buttons", "Inputs".
      category: z.string().optional(),
      // Short pill shown next to the name everywhere it's listed, e.g. "New".
      badge: z.string().optional(),
      // Link to a write-up about how the component was built.
      blog: z.url().optional()
    })
  }
});
var source_config_default = defineConfig({});
export {
  source_config_default as default,
  docs
};
