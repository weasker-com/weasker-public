import { default as ImportedGraphQL } from "graphql";
import { Payload } from "payload";
import { getBadgeQuestions } from "./getBadgeQuestions";
import { getBadgeUsers } from "./getBadgeUsers";
import { getBadgeInterview } from "./getBadgeInterview";
import { getInterviewUser } from "./getInterviewUser";
import { getUserInterviews } from "./getUserInterviews";

export type customGraphQLQueryType = (
  // eslint-disable-next-line no-unused-vars
  GraphQL: typeof ImportedGraphQL,
  // eslint-disable-next-line no-unused-vars
  payload: Payload
) => Record<string, unknown>;
export const customGraphQLQueries: customGraphQLQueryType = (
  GraphQL,
  payload
) => {
  return {
    BadgeQuestions: getBadgeQuestions(GraphQL, payload),
    BadgeUsers: getBadgeUsers(GraphQL, payload),
    BadgeInterview: getBadgeInterview(GraphQL, payload),
    InterviewUser: getInterviewUser(GraphQL, payload),
    UserInterviews: getUserInterviews(GraphQL, payload),
  };
};
