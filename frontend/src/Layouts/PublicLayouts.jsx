import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

function PublicLayouts() {
  return (
    <>
      <Nav />
      <Outlet />
      <footer>Footer</footer>
    </>
  );
}

export default PublicLayouts;
