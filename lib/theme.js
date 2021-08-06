import { future as preset } from "@theme-ui/presets";
import { merge } from "theme-ui";

export default merge(preset, {
  useColorSchemeMediaQuery: true,
  fonts: {
    body: `"Inter", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
    heading: `"Inter", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
  },
  sizes: {
    container: 768,
  },
  fontWeights: {
    heading: 700,
  },
  styles: {
    h1: {
      fontWeight: 600,
    },
    p: {
      fontSize: 2,
    },
    pre: {
      borderRadius: 3,
      fontSize: 2,
    },
    blockquote: {
      opacity: 0.8,
    },
  },
});
