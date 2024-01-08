class PayloadResponseError extends Error {
  parsedResponse: any;

  constructor(parsedResponse: any) {
    super("Payload responded with an error");
    this.name = "PayloadResponseError";
    this.parsedResponse = parsedResponse;
  }
}

const parseJSON = (response: Response) => response.json();

const checkStatus = (response: Response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  return parseJSON(response).then((parsedResponse) => {
    throw new PayloadResponseError(parsedResponse);
  });
};

interface PayLoadFetchInterface {
  query: string;
  method: "POST" | "GET" | "READ";
  collection: "Pages" | "Badges" | "Interviews" | "Questions" | "Users";
  mustHave?: string;
}

export async function fetchData<T>({
  query,
  method,
  collection,
  mustHave,
}: PayLoadFetchInterface): Promise<T | null> {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`${process.env.PAYLOAD_SITE}/api/graphql`, {
      method,
      headers,
      body: JSON.stringify({ query }),
    })
      .then(checkStatus)
      .then(parseJSON);

    if (
      mustHave
        ? response && response.data?.[mustHave]?.docs?.length > 0
        : response
    ) {
      return response;
    } else {
      return null;
    }
  } catch (errors) {
    if (errors instanceof PayloadResponseError) {
      console.error("PayloadResponseError occurred:", errors.parsedResponse);
    }
    console.error(`Error fetching ${collection}:`, errors);
    throw errors;
  }
}
