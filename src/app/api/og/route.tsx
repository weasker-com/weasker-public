import { ImageResponse } from "next/server";
import { useSearchParams } from "next/navigation";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imgA = searchParams.get("imgA");
  const text = searchParams.get("text");
  if (!imgA) {
    return new ImageResponse(<>Visit with &quot;?username=vercel&quot;</>, {
      width: 1200,
      height: 630,
    });
  }
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to right, #007bff, #2524c4)",
          display: "flex",
          fontSize: 50,
          color: "white",
          width: 1200,
          height: 630,
          paddingTop: 50,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          width="256"
          height="256"
          src={`${imgA}`}
          style={{
            borderRadius: 128,
          }}
        />
        <div>{text}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
