import { FC, useState } from "react";
import { classNames } from "../utils";
import { useTheme } from "../context/theme-context";
import Navigation from "./Navigation";

const Layout: FC<{}> = ({ children }) => {
  const { theme } = useTheme();
  return (
    <div className={classNames(theme.theme ? "dark" : "")}>
      <div className="dark:bg-darkDark h-screen">
        <header>
          <Navigation />
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
