// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
var docs = defineDocs({
  dir: "content/docs"
  // docs: {
  //   schema: frontmatterSchema.extend({
  //     links: z
  //       .object({
  //         doc: z.string().optional(),
  //         api: z.string().optional(),
  //       })
  //       .optional(),
  //   }),
  // },
});
var source_config_default = defineConfig({});
export {
  source_config_default as default,
  docs
};
