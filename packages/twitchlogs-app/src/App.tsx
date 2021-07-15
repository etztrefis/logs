import { useEffect } from "react";
import Layout from "./layouts/Layout";
import MainPage from "./pages/Main/MainPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import { ThemeProvider } from "./context/theme-context";

function App() {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    console.log("Location changed", location);
    console.log("History changed", history);
  }, [location, history]);

  return (
    <ThemeProvider>
      <Layout>
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route exact path="/settings">
            <MainPage />
            <SettingsPage />
          </Route>
        </Switch>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
