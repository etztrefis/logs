import { useEffect } from "react";
import MainPage from "./pages/Main/MainPage";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";

function App() {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    console.log("Location changed", location);
  }, [location]);

  return (
    <Switch>
      <Route exact path="/">
        <MainPage />
      </Route>
    </Switch>
  );
}

export default App;
