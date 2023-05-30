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
          keyArgs: [],
          // Concatenate the incoming list items with
          // the existing list items.
          merge(existing = [], incoming, { args }) {
            // console.log(existing);
            // console.log(incoming);
            // console.log([...existing, ...incoming.messages]);
            // return { messages: [...existing, ...incoming.messages] };
            let mergedUsers = existing.users ? existing.users.slice(0) : [];
            let inMergedUsers = false;
            if (incoming.users) {
              for (const user of incoming.users) {
                for (const user2 of mergedUsers) {
                  if (user.__ref == user2.__ref) inMergedUsers = true;
                }

                if (!inMergedUsers) mergedUsers.push(user);
              }

              // prepending items
              let mergedMessages = [
                ...(existing?.messages || []),
                ...incoming.messages,
              ];

              if (args) {
                // only retrieving the latest message due to websocket message received
                if (args.offset == 0 && args.limit == 1) {
                  mergedMessages = [
                    ...incoming.messages,
                    ...(existing?.messages || []),
                  ];
                }

                // message was deleted
                if (args.limit == 0) {
                  mergedMessages = existing.messages.slice();
                  mergedMessages.splice(args.offset, 1);
                }
              }

              return {
                ...incoming,
                messages: mergedMessages,
                hasMore: incoming.hasMore,
                users: mergedUsers,
                newAmount: incoming.newAmount,
              };
            }
          },
        },
        retrieveInChannel: {
          keyArgs: [],
          // Concatenate the incoming list items with
          // the existing list items.
          merge(existing = [], incoming, { args }) {
            // console.log(existing);
            // console.log(incoming);
            // console.log([...existing, ...incoming.messages]);
            // return { messages: [...existing, ...incoming.messages] };
            let mergedUsers = existing.users ? existing.users.slice(0) : [];
            let inMergedUsers = false;
            if (incoming.users) {
              for (const user of incoming.users) {
                for (const user2 of mergedUsers) {
                  if (user.__ref == user2.__ref) inMergedUsers = true;
                }

                if (!inMergedUsers) mergedUsers.push(user);
              }

              let mergedMessages = [
                ...(existing?.messages || []),
                ...incoming.messages,
              ];
              if (args) {
                // only retrieving the latest message due to websocket message received
                if (args.offset == 0 && args.limit == 1) {
                  mergedMessages = [
                    ...incoming.messages,
                    ...(existing?.messages || []),
                  ];
                }

                // message was deleted
                if (args.limit == 0) {
                  mergedMessages = existing.messages.slice();
                  mergedMessages.splice(args.offset, 1);
                }
              }

              return {
                ...incoming,
                messages: mergedMessages,
                hasMore: incoming.hasMore,
                users: mergedUsers,
                newAmount: incoming.newAmount,
              };
            }
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
      localStorage.theme = "dark";
    } else {
      document.getElementById("main")!.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, []);

  return (
    <div id="main">
      <div className="w-screen h-screen overflow-x-hidden dark:bg-gray-900 dark:text-gray-100 bg-gray-50 text-gray-900">
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
