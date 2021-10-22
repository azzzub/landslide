import { useEffect, useState } from "react";
import "./header.css";
import { FaUser, FaArrowLeft } from "react-icons/fa";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import { IconButton } from "@chakra-ui/button";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Stack } from "@chakra-ui/layout";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function Header({ title }) {
  let location = useLocation();
  let history = useHistory();
  let [backButtonVisibility, setBackButtonVisibility] = useState(false);
  let [accountButtonVisibility, setAccountButtonVisibility] = useState(false);
  let [dynamicTitle, setDynamicTitle] = useState("landslide.id");

  useEffect(() => {
    if (location.pathname !== "/") {
      setBackButtonVisibility(true);
    } else {
      setBackButtonVisibility(false);
    }
    if (location.pathname !== "/masuk") {
      setAccountButtonVisibility(true);
    } else {
      setAccountButtonVisibility(false);
    }
    switch (location.pathname) {
      case "/akun":
        setDynamicTitle("Akun Saya");
        break;
      case "/trigger":
        setDynamicTitle("Pengaturan Trigger");
        break;
      case "/masuk":
        setDynamicTitle("Masuk Akun");
        break;

      default:
        setDynamicTitle("landslide.id");
        break;
    }
  }, [location]);

  return (
    <div className="header_container">
      <IconButton
        icon={<FaArrowLeft size="18px" />}
        variant="none"
        color="white"
        visibility={backButtonVisibility ? "visible" : "hidden"}
        onClick={() => history.goBack()}
      />
      <div className="header_title">{title || dynamicTitle}</div>
      <Stack visibility={accountButtonVisibility ? "visible" : "hidden"}>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FaUser size="18px" />}
            variant="none"
            color="white"
            onClick={() =>
              cookies.get("access_token") ?? history.push("/masuk")
            }
          />

          {cookies.get("access_token") && (
            <MenuList>
              <MenuGroup title="Profil">
                <Link to="/akun">
                  <MenuItem>Akun Saya</MenuItem>
                </Link>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="Pengaturan">
                <Link to="/trigger">
                  <MenuItem>Trigger Alarm</MenuItem>
                </Link>
              </MenuGroup>
              <MenuDivider />
              <Link to="/keluar">
                <MenuItem fontWeight="bold">Keluar</MenuItem>
              </Link>
            </MenuList>
          )}
        </Menu>
      </Stack>
    </div>
  );
}

export default Header;
