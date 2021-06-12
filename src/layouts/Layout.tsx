import { FC, Fragment, useState } from "react";
import Navigation from "./Navigation";

const Layout: FC<{}> = ({ children }) => {
  const [isWhite, setWhite] = useState(false);
  return (
    <Fragment>
      <header className={!isWhite ? "dark" : ""}>
        <Navigation enabled={isWhite} setEnabled={setWhite} />
      </header>
      <main>{children}</main>
    </Fragment>
  );
};

export default Layout;
