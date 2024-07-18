//example: www.weasker.com/api/hp

import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
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
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            textTransform: "capitalize",
            color: "#253c4c",
            width: "80%",
            height: "80%",
          }}
        >
          <div
            style={{
              fontSize: "60px",
              color: "#253c4c",
              paddingTop: "10px",
              textAlign: "center",
            }}
          >
            weasker.com
          </div>
          <div
            style={{
              fontSize: "100px",
              color: "#253c4c",
              paddingTop: "10px",
              textAlign: "center",
              lineHeight: "90px",
              fontWeight: "bolder",
            }}
          >
            {process.env.SITE_SLOGAN}
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
