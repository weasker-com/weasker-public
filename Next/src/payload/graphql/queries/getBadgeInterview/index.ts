import buildPaginatedListType from "../../utilities/buildPaginatedListType";
import type { default as ImportedGraphQL } from "graphql";
import type { Payload } from "payload";
import { Resolver } from "./resolver";

export const getBadgeInterview = (
  GraphQL: typeof ImportedGraphQL,
  payload: Payload
) => {
  return {
    args: {
      badgeSlug: { type: GraphQL.GraphQLString },
      interviewSlug: { type: GraphQL.GraphQLString },
    },
    resolve: Resolver,
    type: buildPaginatedListType(
      "badgeInterview",
      payload.collections["interviews"].graphQL.type
    ),
  };
};
