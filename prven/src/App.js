import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import EnvStatus from "./components/atoms/envStatus";
import Header from "./components/header";
import Account from "./components/pages/account";
import Home from "./components/pages/home";

function App() {
  return (
    <Router>
      <div className="canvas">
        <div className="paper">
          <EnvStatus />
          <Header />
          <Switch>
            <Route path="/akun">{<Account />}</Route>
            <Route path="/">{<Home />}</Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
