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
    <div style={styles.container}>
      <ApolloProvider client={client}>
        <NavBar />
        <Component {...pageProps} />
      </ApolloProvider>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#222",
    color: "#fff",
    height: "100vh",
    width: "100vw",
    margin: "0",
  },
} as const;

export default MyApp;
