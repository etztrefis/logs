import { createContext, useContext, useReducer, ReactNode } from "react";

type Action = { type: "lightmode" } | { type: "darkmode" };
type Dispatch = (action: Action) => void;
type State = { theme: boolean };
type CountProviderProps = { children: ReactNode };

const ThemeContext = createContext<
  { theme: State; dispatch: Dispatch } | undefined
>(undefined);

function themeReducer(theme: State, action: Action) {
  switch (action.type) {
    case "lightmode":
      return { theme: false };
    case "darkmode":
      return { theme: true };
    default:
      return theme;
  }
}
function ThemeProvider({ children }: CountProviderProps) {
  const [theme, dispatch] = useReducer(themeReducer, { theme: true });
  const value = { theme, dispatch };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeProvider, useTheme };
