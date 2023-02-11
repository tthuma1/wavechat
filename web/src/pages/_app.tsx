import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import type { AppProps } from "next/app";
import NavBar from "../components/NavBar";
import "../styles/globals.css";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        retrieveDM: {
          // Don't cache separate results based on
          // any of this field's arguments.
          keyArgs: false,
          // Concatenate the incoming list items with
          // the existing list items.
          merge(existing = [], incoming) {
            // console.log(existing);
            // console.log(incoming);
            // console.log([...existing, ...incoming.messages]);
            // return { messages: [...existing, ...incoming.messages] };
            let mergedUsers = existing.users ? existing.users.slice(0) : [];
            let inMergedUsers = false;
            for (const user of incoming.users) {
              for (const user2 of mergedUsers) {
                if (user.__ref == user2.__ref) inMergedUsers = true;
              }

              if (!inMergedUsers) mergedUsers.push(user);
            }

            return {
              ...incoming,
              messages: [...(existing?.messages || []), ...incoming.messages],
              hasMore: incoming.hasMore,
              users: mergedUsers,
            };
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache,
  credentials: "include",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="w-screen h-screen bg-gray-900 text-gray-100">
      <ApolloProvider client={client}>
        {/* <NavBar /> */}
        <Component {...pageProps} />
      </ApolloProvider>
    </div>
  );
}

export default MyApp;
