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

function redirectNonWwwTraffic(req, res, next) {
  if (
    /^localhost(:\d+)?$/.test(req.headers.host) ||
    req.headers.host.slice(0, 4) === "www."
  ) {
    return next();
  }
  var newHost = "www." + req.headers.host;
  return res.redirect(301, req.protocol + "://" + newHost + req.originalUrl);
}

app.set("trust proxy", true);
if (process.env.NODE_ENV !== "development") {
  app.use(redirectNonWwwTraffic);
}
app.use(mediaManagement(cloudinaryConfig));

const setRobotsHeader = (req, res, next) => {
  if (req.hostname === "weasker.up.railway.app") {
    res.set("X-Robots-Tag", "noindex");
  }
  next();
};

app.use(setRobotsHeader);

app.get(
  "/question/:communitiesSlugOrBadgeSlug/:questionSlugOrInterviewSlug/:idOrQuestionSlug?",
  async (req, res, next) => {
    const { communitiesSlugOrBadgeSlug, idOrQuestionSlug } = req.params;

    const payload = await getPayloadClient();

    try {
      let questionFound = false;

      // First, check if we can find a question by its ID
      if (idOrQuestionSlug && /^[0-9a-fA-F]{24}$/.test(idOrQuestionSlug)) {
        const result = await payload.find({
          collection: "questions",
          where: { id: { equals: idOrQuestionSlug } },
        });

        if (result.docs.length > 0) {
          questionFound = true;
          const question = result.docs[0];
          const latestCommunitiesSlug = question.communitiesSlug;
          const latestQuestionSlug = question.questionSlug;

          const expectedPath = `/question/${latestCommunitiesSlug}/${latestQuestionSlug}/${idOrQuestionSlug}`;
          if (req.url !== expectedPath) {
            return res.redirect(301, expectedPath);
          }
        }
      }

      // If not found or not a valid ID, check if we can find a community by its slug (badgeSlug)
      if (!questionFound) {
        const communityResult = await payload.find({
          collection: "communities",
          where: { slug: { equals: communitiesSlugOrBadgeSlug } },
        });

        if (communityResult.docs.length > 0) {
          console.log("question not found, found community");
          const community = communityResult.docs[0];
          const communityId = community.id;
          const communitySlug = community.slug;

          const expectedPath = `/community/${communitySlug}/${communityId}`;
          return res.redirect(301, expectedPath);
        }
      }

      next();
    } catch (err) {
      console.error(err);
      next();
    }
  }
);

app.get("/community/:communitiesSlug/:id", async (req, res, next) => {
  const { id } = req.params;

  const payload = await getPayloadClient();

  try {
    const result = await payload.find({
      collection: "communities",
      where: { id: { equals: id } },
    });

    if (result.docs.length > 0) {
      const community = result.docs[0];
      const latestCommunitiesSlug = community.slug;

      const expectedPath = `/community/${latestCommunitiesSlug}/${id}`;
      if (req.url !== expectedPath) {
        return res.redirect(301, expectedPath);
      }
    }

    next();
  } catch (err) {
    console.error(err);
    next();
  }
});

app.get("/badge/:badgeSlug", async (req, res, next) => {
  const { badgeSlug } = req.params;

  const payload = await getPayloadClient();

  try {
    const result = await payload.find({
      collection: "communities",
      where: { slug: { equals: badgeSlug } },
    });

    if (result.docs.length > 0) {
      const community = result.docs[0];
      const communityId = community.id;

      const expectedPath = `/community/${badgeSlug}/${communityId}`;
      return res.redirect(301, expectedPath);
    }

    next();
  } catch (err) {
    console.error(err);
    next();
  }
});

app.get(
  "/interview/:badgeSlug/:userSlugOrAll/:interviewSlug",
  async (req, res, next) => {
    const { badgeSlug, userSlugOrAll } = req.params;

    const payload = await getPayloadClient();

    try {
      if (userSlugOrAll === "all") {
        const communityResult = await payload.find({
          collection: "communities",
          where: { slug: { equals: badgeSlug } },
        });

        if (communityResult.docs.length > 0) {
          const community = communityResult.docs[0];
          const communityId = community.id;
          const expectedPath = `/community/${badgeSlug}/${communityId}`;
          return res.redirect(301, expectedPath);
        }
      } else {
        const userResult = await payload.find({
          collection: "users",
          where: { slug: { equals: userSlugOrAll } },
        });

        if (userResult.docs.length > 0) {
          const user = userResult.docs[0];
          const userId = user.id;
          const expectedPath = `/user/${userSlugOrAll}/${userId}`;
          return res.redirect(301, expectedPath);
        }
      }

      next();
    } catch (err) {
      console.error(err);
      next();
    }
  }
);

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
