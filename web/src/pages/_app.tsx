import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import type { AppProps } from "next/app";
import NavBar from "../components/NavBar";
import "../styles/globals.css";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
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
