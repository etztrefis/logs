import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { Page } from "../types/page";
import { Fragment } from "react";
import { ThemeProvider } from "next-themes";

type Props = AppProps & {
  Component: Page;
};

function MyApp({ Component, pageProps }: Props) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const Layout = Component.layout ?? Fragment;

  return (
    <ThemeProvider attribute="class">
      <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
    </ThemeProvider>
  );
}
export default MyApp;
