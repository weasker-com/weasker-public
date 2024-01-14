import path from 'path'
import { payloadCloud } from '@payloadcms/plugin-cloud'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { buildConfig } from 'payload/config'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import Users from './collections/Users/index'
import { Pages } from './collections/Pages/index'
import { Media } from './collections/Media/index'
import { Badges } from './collections/Badges/index'
import { Interviews } from './collections/Interviews/index'
import { customGraphQLQueries } from './graphql/queries'
import cloudinaryPlugin from 'payload-cloudinary-plugin/dist/plugins'

export default buildConfig({
	collections: [Users, Pages, Media, Badges, Interviews],
	serverURL: process.env.PAYLOAD_PUBLIC_EXTERNAL_SERVER_URL,
	admin: {
		user: Users.slug,
		bundler: webpackBundler(),
	},
	cors: process.env.WHITELIST_ORIGINS ? process.env.WHITELIST_ORIGINS.split(',') : [],
	csrf: process.env.WHITELIST_ORIGINS ? process.env.WHITELIST_ORIGINS.split(',') : [],
	editor: lexicalEditor({}),

	typescript: {
		outputFile: path.resolve(__dirname, 'payload-types.ts'),
	},
	graphQL: {
		schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
		queries: customGraphQLQueries,
	},
	plugins: [payloadCloud(), cloudinaryPlugin()],
	db: mongooseAdapter({
		url: process.env.DATABASE_URI,
	}),
})
