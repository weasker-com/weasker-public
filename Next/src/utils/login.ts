class PayloadResponseError extends Error {
  parsedResponse: any;

  constructor(parsedResponse: any) {
    super("Payload responded with an error");
    this.name = "PayloadResponseError";
    this.parsedResponse = parsedResponse;
  }
}

export const login = async (query: string): Promise<any> => {
  const parseJSON = (response: Response) => response.json();
  try {
    const res = await fetch(`http://localhost:4000/api/graphql`, {
      method: "POST",
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
