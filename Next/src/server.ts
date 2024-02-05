import dotenv from "dotenv";
import next from "next";
import nextBuild from "next/dist/build";
import path from "path";
import express from "express";
import { getPayloadClient } from "./payload/payload-client";
import { v2 as cloudinary } from "cloudinary";
import { mediaManagement } from "payload-cloudinary-plugin";
import email from "./payload/email/transport";

dotenv.config({
  path: path.resolve(__dirname, "../.env.local"),
});

const app = express();
const PORT = process.env.PORT || 3000;

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(mediaManagement(cloudinaryConfig));

const setRobotsHeader = (req, res, next) => {
  if (req.hostname === "weasker.up.railway.app") {
    res.set("X-Robots-Tag", "noindex");
  }
  next();
};

app.use(setRobotsHeader);

const start = async (): Promise<void> => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      email,
      onInit: async (newPayload) => {
        newPayload.logger.info(
          `Payload Admin URL: ${newPayload.getAdminURL()}`
        );
      },
    },
  });

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info(`Next.js is now building...`);
      // @ts-expect-error
      await nextBuild(path.join(__dirname, ".."));
      process.exit();
    });

    return;
  }

  const nextApp = next({
    dev: process.env.NODE_ENV !== "production",
  });

  const nextHandler = nextApp.getRequestHandler();

  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info("Next.js started");

    app.listen(PORT, async () => {
      payload.logger.info(`Next.js app listening on port ${PORT}`);
    });
  });
};

start();
