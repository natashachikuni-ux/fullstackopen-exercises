import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Constants from 'expo-constants';

const httpLink = createHttpLink({
  uri: Constants.expoConfig?.extra?.apolloUri,
});

// 1. Define the cache with merge logic
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        repositories: {
          keyArgs: ["orderBy", "orderDirection", "searchKeyword"],
          merge(existing, incoming) {
            const existingEdges = existing ? existing.edges : [];
            const incomingEdges = incoming ? incoming.edges : [];

            // 1. Create a Set of existing IDs to track what we already have
            const existingIds = new Set(existingEdges.map((edge: any) => edge.node.id));

            // 2. Only add incoming edges that AREN'T already in our list
            const newEdges = incomingEdges.filter(
              (edge: any) => !existingIds.has(edge.node.id)
            );

            return {
              ...incoming,
              edges: [...existingEdges, ...newEdges],
            };
          },
        },
      },
    },
  },
});

const createApolloClient = (authStorage: any) => {
  const authLink = setContext(async (_, { headers }) => {
    try {
      const accessToken = await authStorage.getAccessToken();
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    } catch (e) {
      console.log(e);
      return { headers };
    }
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache, // 2. Use the configured cache variable
  });
};

export default createApolloClient;