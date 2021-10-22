import Cookies from "universal-cookie";
import { useHistory } from "react-router";
import { useEffect } from "react";

const cookies = new Cookies();

function Logout() {
  const history = useHistory();
  useEffect(() => {
    cookies.remove("access_token");
    history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
}

export default Logout;
