import { ReactNode } from "react";
import { Navigation } from "../components";
import Home from "../pages/index";

type defProps = { children: ReactNode };

export default function Layout({ children }: defProps) {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>
        {children}
      </main>
    </>
  );
}
