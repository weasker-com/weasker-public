import { getPayloadClient } from "../../../payload-client";

export const slugSelectOptions = async (data) => {
  if (data.interview) {
    try {
      const payload = await getPayloadClient();

      const interview = await payload.findByID({
        collection: "interviews",
        id: data.interview,
        depth: 2,
      });

      const options = interview.questions.map((question) => ({
        label: question.question.seo.slug,
        value: question.id,
      }));

      return options;
    } catch (error) {
      console.error("Error fetching user or constructing badge filter", error);
      return [];
    }
  } else {
    return [];
  }
};
