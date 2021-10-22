import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import EnvStatus from "./components/atoms/envStatus";
import Header from "./components/header";
import Logout from "./components/logout";
import NotFound from "./components/pages/404";
import Account from "./components/pages/account";
import Home from "./components/pages/home";
import Login from "./components/pages/login";
import Trigger from "./components/pages/trigger";

function App() {
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
              <Route path="/trigger" exact>
                {<Trigger />}
              </Route>
              <Route path="/keluar" exact>
                {<Logout />}
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
