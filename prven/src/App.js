import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import EnvStatus from "./components/atoms/envStatus";
import Header from "./components/header";
import NotFound from "./components/pages/404";
import Account from "./components/pages/account";
import Home from "./components/pages/home";
import SettingTrigger from "./components/pages/settings/trigger";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Login from "./components/pages/login";
import axios from "axios";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchSession() {
    try {
      const result = await axios.get(
        process.env.REACT_APP_ENDPOINT + "/trigger",
        {
          withCredentials: true,
          headers: {
            Authorization: "Bearer asdfs",
          },
        }
      );
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSession();
  }, []);

  if (isLoading) {
    return <>Loading</>;
  }

  return (
    <Router>
      <div className="canvas">
        <div className="paper">
          <EnvStatus />
          <Header />
          <main className="main">
            <Switch>
              <Route path="/masuk" exact>
                {<Login />}
              </Route>
              <Route path="/akun" exact>
                {<Account />}
              </Route>
              <Route path="/pengaturan/trigger" exact>
                {<SettingTrigger />}
              </Route>
              <Route path="/" exact>
                {<Home />}
              </Route>
              <Route path="*" exact>
                {<NotFound />}
              </Route>
            </Switch>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
