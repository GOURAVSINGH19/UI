import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
// fumadocs-mdx validates with zod v4, so extend with the v4 API.
import { z } from "zod/v4";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      // Groups the page on /components, e.g. "Buttons", "Inputs".
      category: z.string().optional(),
      // Short pill shown next to the name everywhere it's listed, e.g. "New".
      badge: z.string().optional(),
      // Link to a write-up about how the component was built.
      blog: z.url().optional(),
    }),
  },
});

export default defineConfig({});
