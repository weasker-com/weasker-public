import { RuleType } from "../../types/rule-type"; // Make sure to adjust the path if it's different

type ContextType = {
  document: {
    _id: string;
    interview: {
      _ref: string;
    };
  };
  getClient: (options: { apiVersion: string }) => {
    fetch: (query: string, params: any) => Promise<boolean>;
  };
};

export async function isUniqueForSameInterview(
  slug: string,
  context: ContextType
): Promise<boolean> {
  const { document, getClient } = context;
  const client = getClient({ apiVersion: "2022-12-07" });
  const id = document._id.replace(/^drafts\./, "");
  const interviewRefId = document.interview._ref;

  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
    interviewRefId,
  };

  const query = `
    !defined(
      *[
        !(_id in [$draft, $published]) 
        && slug.current == $slug 
        && interview._ref == $interviewRefId
      ][0]._id
    )
  `;

  const result = await client.fetch(query, params);
  return result;
}
