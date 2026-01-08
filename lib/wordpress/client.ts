/**
 * WordPress GraphQL Client
 * Minimal Apollo Client setup for server and client components
 */

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { siteConfig } from '@/lib/config';

// Server-side Apollo Client (for RSC)
export const { getClient } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: siteConfig.wordpress.graphqlEndpoint,
            fetchOptions: { cache: 'no-store' }, // Always fresh for server components
        }),
    });
});

// Client-side Apollo Client factory (for client components)
function makeClient() {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: siteConfig.wordpress.graphqlEndpoint,
        }),
    });
}

export { makeClient };
