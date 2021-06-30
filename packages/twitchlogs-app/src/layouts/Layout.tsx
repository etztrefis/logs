import { FC, useState } from "react";
import { classNames } from "../utils";
import Navigation from "./Navigation";

const Layout: FC<{}> = ({ children }) => {
  const [isWhite, setWhite] = useState(false);
  return (
    <div className={classNames(!isWhite ? "dark" : "")}>
      <div className="dark:bg-darkDark h-screen">
        <header>
          <Navigation enabled={isWhite} setEnabled={setWhite} />
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
