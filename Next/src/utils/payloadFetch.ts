const parseJSON = (response: Response) => response.json();

const checkStatus = (response: Response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  return parseJSON(response).then((parsedResponse) => {
    throw parsedResponse;
  });
};

export async function fetchData<T>(
  query: string,
  method: "POST" | "GET" | "READ",
  collection: "Pages" | "Badges" | "Interviews" | "Questions" | "Users",
  mustHave?: string
): Promise<T | null> {
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
    console.error(`Error fetching ${collection}:`, errors);
    throw errors;
  }
}
