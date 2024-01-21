class PayloadResponseError extends Error {
  parsedResponse: any;

  constructor(parsedResponse: any) {
    super("Payload responded with an error");
    this.name = "PayloadResponseError";
    this.parsedResponse = parsedResponse;
  }
}

export const USER = `
  id
  userName
  email
  firstName
  lastName
  seo{image{url filename}}
`;

interface qglInterface {
  query: string;
  method: "POST" | "GET" | "READ";
}

export const gql = async ({ query, method }: qglInterface): Promise<any> => {
  const parseJSON = (response: Response) => response.json();
  try {
    console.log(
      "PAYLOAD_PUBLIC",
      process.env.PAYLOAD_PUBLIC_EXTERNAL_SERVER_URL
    );
    const res = await fetch(`http://localhost:4000/api/graphql`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    }).then(parseJSON);

    if (res) {
      return res;
    }
  } catch (errors) {
    if (errors instanceof PayloadResponseError) {
      console.error("PayloadResponseError occurred:", errors.parsedResponse);
    }
    console.error(`Error fetching:`, errors);
    throw errors;
  }
};
