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

function Header({ title }) {
  let location = useLocation();
  let history = useHistory();
  let [backButtonVisibility, setBackButtonVisibility] = useState(false);
  let [dynamicTitle, setDynamicTitle] = useState("landslide.id");

  useEffect(() => {
    if (location.pathname !== "/" && location.pathname !== "/login") {
      setBackButtonVisibility(true);
    } else {
      setBackButtonVisibility(false);
    }
    switch (location.pathname) {
      case "/akun":
        setDynamicTitle("Akun Saya");
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
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<FaUser size="18px" />}
          variant="none"
          color="white"
        >
          Profile
        </MenuButton>
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
            <MenuItem>Kalibrasi Sensor</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Bantuan">
            <MenuItem>Kontak</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuItem fontWeight="bold">Keluar</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}

export default Header;
