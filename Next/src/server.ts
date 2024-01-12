import dotenv from 'dotenv'
import next from 'next'
import nextBuild from 'next/dist/build'
import path from 'path'

dotenv.config({
	path: path.resolve(__dirname, '../.env.local'),
})

import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

console.log('NODE_ENV', process.env.NODE_ENV)

const start = async (): Promise<void> => {
	if (process.env.NEXT_BUILD) {
		app.listen(PORT, async () => {
			console.log(`Next.js is now building...`)
			// @ts-expect-error
			await nextBuild(path.join(__dirname, '..'))
			process.exit()
		})

		return
	}

	const nextApp = next({
		dev: process.env.NODE_ENV !== 'production',
	})

	const nextHandler = nextApp.getRequestHandler()

	app.use((req, res) => nextHandler(req, res))

	nextApp.prepare().then(() => {
		console.log('Next.js started')

		app.listen(PORT, async () => {
			console.log(`Next.js app listening on port ${PORT}`)
		})
	})
}

start()
