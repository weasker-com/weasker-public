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
  email
  firstName
  lastName
`;

export const gql = async (query: string): Promise<any> => {
  const parseJSON = (response: Response) => response.json();
  try {
    const res = await fetch(
      `${process.env.PAYLOAD_PUBLIC_EXTERNAL_SERVER_URL}/api/graphql`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      }
    ).then(parseJSON);

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
