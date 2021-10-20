import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import EnvStatus from "./components/atoms/envStatus";
import Header from "./components/header";
import NotFound from "./components/pages/404";
import Account from "./components/pages/account";
import Home from "./components/pages/home";
import SettingTrigger from "./components/pages/settings/trigger";

function App() {
  return (
    <Router>
      <div className="canvas">
        <div className="paper">
          <EnvStatus />
          <Header />
          <main className="main">
            <Switch>
              <Route path="/akun" exact>
                {<Account />}
              </Route>
              <Route path="/trigger" exact>
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
