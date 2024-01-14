import buildPaginatedListType from "../../utilities/buildPaginatedListType";
import type { default as ImportedGraphQL } from "graphql";
import type { Payload } from "payload";
import { Resolver } from "./resolver";

export const getSearchResults = (
  GraphQL: typeof ImportedGraphQL,
  payload: Payload
) => {
  return {
    args: {
      searchTerms: { type: GraphQL.GraphQLString },
    },
    resolve: Resolver,
    type: buildPaginatedListType(
      "interviewQuestion",
      payload.collections["interviews"].graphQL.type
    ),
  };
};
