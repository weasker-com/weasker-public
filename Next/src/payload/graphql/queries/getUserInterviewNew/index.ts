import buildPaginatedListType from "../../utilities/buildPaginatedListType";
import type { default as ImportedGraphQL } from "graphql";
import type { Payload } from "payload";
import { Resolver } from "./resolver";

export const getBadgeInterviewNew = (
  GraphQL: typeof ImportedGraphQL,
  payload: Payload
) => {
  return {
    args: {
      userSlug: { type: GraphQL.GraphQLString },
      interviewSlug: { type: GraphQL.GraphQLString },
    },
    resolve: Resolver,
    type: buildPaginatedListType(
      "userInterviewNew",
      payload.collections["users-interviews"].graphQL.type
    ),
  };
};
