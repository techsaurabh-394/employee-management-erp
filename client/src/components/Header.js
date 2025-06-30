import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header>
      <span>{user?.name}</span>
      <button onClick={logout}>Sign Out</button>
    </header>
  );
};

export default Header;
