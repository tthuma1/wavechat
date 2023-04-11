import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import Script from "next/script";
import { useEffect } from "react";

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
              newAmount: incoming.newAmount,
            };
          },
        },
        retrieveInChannel: {
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
              newAmount: incoming.newAmount,
            };
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_DOMAIN}/graphql`,
  cache,
  credentials: "include",
});

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.getElementById("main")!.classList.add("dark");
    } else {
      document.getElementById("main")!.classList.remove("dark");
    }
  }, []);

  return (
    <div id="main">
      <div className="w-screen h-screen dark:bg-gray-900 dark:text-gray-100 bg-gray-50 text-gray-900">
        <Script
          src="https://kit.fontawesome.com/c5fdb8664c.js"
          crossOrigin="anonymous"
        />
        <Script src="https://sdk.amazonaws.com/js/aws-sdk-2.619.0.min.js" />

        <ApolloProvider client={client}>
          {/* <NavBar /> */}
          <Component {...pageProps} />
        </ApolloProvider>
      </div>
    </div>
  );
}

export default MyApp;
