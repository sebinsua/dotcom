/** @jsxImportSource theme-ui */
import Router from "next/router";
import App from "next/app";
import NProgress from "next-nprogress-emotion";
import debounce from "lodash.debounce";
import { ThemeProvider } from "theme-ui";

import theme from "@lib/theme";

import "typeface-inter";
import "@styles/global.css";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <NProgress spinner={false} />
        <div
          sx={{
            maxWidth: `container`,
            mx: `auto`,
            px: 3,
            pt: 4,
          }}
        >
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    );
  }
}
