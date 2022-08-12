import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import type { AppProps } from "next/app";
import NavBar from "../components/NavBar";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
  credentials: "include",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <NavBar />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
