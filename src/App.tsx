import { useEffect } from "react";
import Layout from "./layouts/Layout";
import MainPage from "./pages/Main/MainPage";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";

function App() {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    console.log("Location changed", location);
    console.log("History changed", history);
  }, [location, history]);

  return (
    <Layout>
      <Switch>
        <Route exact path="/">
          <MainPage />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
