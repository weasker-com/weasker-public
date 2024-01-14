import buildPaginatedListType from "../../utilities/buildPaginatedListType";
import type { default as ImportedGraphQL } from "graphql";
import type { Payload } from "payload";
import { Resolver } from "./resolver";

export const getUserInterviews = (
  GraphQL: typeof ImportedGraphQL,
  payload: Payload
) => {
  return {
    args: { slug: { type: GraphQL.GraphQLString } },
    resolve: Resolver,
    type: buildPaginatedListType(
      "userInterview",
      payload.collections["interviews"].graphQL.type
    ),
  };
};
