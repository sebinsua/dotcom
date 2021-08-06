import { useCallback } from "react";
import { useColorMode } from "theme-ui";

export default function useTheme() {
  const [colorMode, setColorMode] = useColorMode();

  const toggleColorMode = useCallback(
    () => setColorMode(colorMode === "light" ? "dark" : "light"),
    [colorMode, setColorMode]
  );

  return [colorMode, toggleColorMode];
}
