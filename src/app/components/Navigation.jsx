import React from "react";
import { Link, NavLink } from "react-router-dom";
// import { NavLink } from "react-router";
import { connect } from "react-redux";

export const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item active">
          <NavLink
            activeStyle={{
              fontWeight: "bolder",
              backgroundColor: "#34c0eb",
              borderRadius: "10px",
              color: "white",
            }}
            className="nav-link"
            to="/dashboard"
          >
            برنامه کاری
          </NavLink>
        </li>
        <li className="nav-item active">
          <NavLink
            activeStyle={{
              color: "white",
              fontWeight: "bolder",
              backgroundColor: "#34c0eb",
              borderRadius: "10px",
            }}
            className="nav-link"
            to="/reserve"
          >
            رزرو
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default connect((state) => state)(Navigation);
