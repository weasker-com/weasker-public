import express from "express";
import payload from "payload";
import { mediaManagement } from "payload-cloudinary-plugin";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
require("dotenv").config();

require("dotenv").config();
const app = express();

app.get("/", (_, res) => {
  res.redirect("/admin");
});

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(mediaManagement(cloudinaryConfig));

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Add your own express routes here

  app.listen(process.env.PORT);
};

start();
