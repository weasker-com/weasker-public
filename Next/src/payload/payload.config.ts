import path from "path";
import { payloadCloud } from "@payloadcms/plugin-cloud";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { buildConfig } from "payload/config";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import Users from "./collections/Users/index";
import { Pages } from "./collections/Pages/index";
import { Media } from "./collections/Media/index";
import { Badges } from "./collections/Badges/index";
import { Applications } from "./collections/Applications/index";
import { Interviews } from "./collections/Interviews/index";
import cloudinaryPlugin from "payload-cloudinary-plugin/dist/plugins";
import UsersInterviews from "./collections/UsersInterviews";

const mockModulePath = path.resolve(__dirname, "./emptyModule.js");

export default buildConfig({
  collections: [
    Users,
    Pages,
    Media,
    Badges,
    Interviews,
    Applications,
    UsersInterviews,
  ],
  serverURL: process.env.PAYLOAD_PUBLIC_EXTERNAL_SERVER_URL,
  rateLimit: {
    window: 90000,
    max: 500,
  },

  maxDepth: 10,
  admin: {
    css: path.resolve(__dirname, "./stylesheet.css"),
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config?.resolve,
        alias: [
          "fs",
          "handlebars",
          "inline-css",
          path.resolve(__dirname, "./email/transport"),
          path.resolve(__dirname, "./email/generateEmailHTML"),
          path.resolve(__dirname, "./email/generateForgotPasswordEmail"),
          path.resolve(__dirname, "./email/generateVerificationEmail"),
        ].reduce(
          (aliases, importPath) => ({
            ...aliases,
            [importPath]: mockModulePath,
          }),
          config.resolve.alias
        ),
      },
    }),
  },
  cors: process.env.WHITELIST_ORIGINS
    ? process.env.WHITELIST_ORIGINS.split(",")
    : [],
  csrf: process.env.WHITELIST_ORIGINS
    ? process.env.WHITELIST_ORIGINS.split(",")
    : [],
  editor: lexicalEditor({}),

  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [payloadCloud(), cloudinaryPlugin()],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  debug: process.env.NODE_ENV !== "production",
});
