//example: www.weasker.com/api/og?img=${image}&preTitle=${process.env.SITE_NAME}&title=${pageName}

import { ImageResponse } from "next/og";

export const runtime = "edge";

function replaceWebpWithPng(inputString: string) {
  return inputString.replace(/webp/g, "png");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const img = searchParams.get("img");
  const preTitle = searchParams.get("preTitle");
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const meta = searchParams.get("meta");
  const notWebpImg = img ? replaceWebpWithPng(img) : null;

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          fontWeight: "bold",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            background: "white",
            display: "flex",
            flexDirection: "column",
            textTransform: "capitalize",
            border: "2px",
            borderRadius: "7px",
            color: "#253c4c",
            width: "80%",
            height: "80%",
            paddingLeft: "5%",
            paddingRight: "10%",
            paddingTop: "3%",
          }}
        >
          <div
            style={{
              background: "white",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: "10px",
              textTransform: "capitalize",
            }}
          >
            {notWebpImg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                width="70"
                height="70"
                src={notWebpImg}
                style={{
                  top: "40px",
                  border: "2px",
                  borderRadius: 128,
                }}
              />
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                textTransform: "capitalize",
              }}
            >
              {preTitle && (
                <span
                  style={{
                    fontSize: 20,
                  }}
                >
                  {preTitle}
                </span>
              )}

              {title && (
                <span
                  style={{
                    fontSize: 50,
                  }}
                >
                  {title}
                </span>
              )}
              {description && (
                <span
                  style={{
                    fontSize: 20,
                    paddingTop: "50px",
                  }}
                >
                  {description}
                </span>
              )}
              {meta && (
                <span
                  style={{
                    fontSize: 20,
                    paddingTop: "50px",
                  }}
                >
                  {meta}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifySelf: "end" }}>weasker.com</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
