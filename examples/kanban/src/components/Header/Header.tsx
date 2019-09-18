import { Link } from "@prodo/route";
import * as React from "react";
// @ts-ignore
import FaSignIn from "react-icons/lib/fa/sign-in";
// @ts-ignore
import FaSignOut from "react-icons/lib/fa/sign-out";
// @ts-ignore
import FaUserSecret from "react-icons/lib/fa/user-secret";
// @ts-ignore
import kanbanLogo from "../../assets/images/kanban-logo.svg";
import { state, watch } from "../../model";
import "./Header.scss";

function Header() {
  const user = watch(state.user);
  return (
    <header>
      <Link to="/" className="header-title">
        <img src={kanbanLogo} alt="React Kanban logo" />
        &nbsp;React Kanban
      </Link>
      <div className="header-right-side">
        {user ? (
          <img
            src={user.imageUrl}
            alt={user.name}
            className="user-thumbnail"
            title={user.name}
          />
        ) : (
          <FaUserSecret className="guest-icon" />
        )}
        {user ? (
          <a className="signout-link" href="/auth/signout">
            <FaSignOut className="signout-icon" />
            &nbsp;Sign out
          </a>
        ) : (
          <a className="signout-link" href="/">
            <FaSignIn className="signout-icon" />
            &nbsp;Sign in
          </a>
        )}
      </div>
    </header>
  );
}

export default Header;
