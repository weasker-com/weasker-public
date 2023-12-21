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
  queryName?: "BadgeInterview" | "InterviewUser" | "UserInterviews"
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
      queryName
        ? response && response.data?.[queryName]?.docs?.length > 0
        : response && response.data?.[collection].docs.length > 0
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
