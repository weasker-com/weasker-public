//example: www.weasker.com/api/og?img=${image}&preTitle=${process.env.SITE_NAME}&title=${pageName}

import { ImageResponse } from "next/og";

export const runtime = "edge";

function replaceWebpWithPng(inputString: string) {
  return inputString.replace(/webp/g, "png");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const img = searchParams.get("img");
  const smallImg = searchParams.get("smallImg");
  const title = searchParams.get("title");
  const preTitle = searchParams.get("preTitle");

  const notWebpImg = img ? replaceWebpWithPng(img) : null;
  const notWebpSmallImg = smallImg ? replaceWebpWithPng(smallImg) : null;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to right, #04032D 5.11%, #0D0D0D 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          fontSize: 70,
          fontWeight: "bold",
          color: "white",
          width: 1200,
          height: 630,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "30px",
            margin: "5px auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {notWebpSmallImg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                width="200"
                height="200"
                src={notWebpSmallImg}
                style={{
                  borderRadius: 128,
                }}
              />
            )}
            {notWebpImg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                width="200"
                height="200"
                src={notWebpImg}
                style={{
                  borderRadius: 128,
                }}
              />
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "700px",
              textTransform: "capitalize",
            }}
          >
            {preTitle && (
              <span
                style={{
                  fontWeight: 100,
                  fontSize: 30,
                }}
              >
                {preTitle}
              </span>
            )}
            {title && (
              <span
                style={{
                  fontWeight: "900",
                }}
              >
                {title}
              </span>
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
