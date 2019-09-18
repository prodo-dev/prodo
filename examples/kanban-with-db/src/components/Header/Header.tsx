import * as React from "react";
import { Link } from "react-router-dom";
// @ts-ignore
import FaUserSecret from "react-icons/lib/fa/user-secret";
// @ts-ignore
import FaSignOut from "react-icons/lib/fa/sign-out";
// @ts-ignore
import FaSignIn from "react-icons/lib/fa/sign-in";
// @ts-ignore
import kanbanLogo from "../../assets/images/kanban-logo.svg";
import "./Header.scss";
import { state, watch, db } from "../../model";
import Spinner from "../Spinner/Spinner";
import NotFound from "../NotFound/NotFound";

function Header() {
  const userId = watch(state.userId);
  const user = db.users.watch(userId);
  if (user._notFound) return <NotFound missing={`users.${userId}`} />;
  if (user._fetching) return <Spinner />;
  return (
    <header>
      <Link to="/" className="header-title">
        <img src={kanbanLogo} alt="React Kanban logo" />
        &nbsp;React Kanban
      </Link>
      <div className="header-right-side">
        {user ? (
          <img
            src={user.data.imageUrl}
            alt={user.data.name}
            className="user-thumbnail"
            title={user.data.name}
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
