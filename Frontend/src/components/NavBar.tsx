import React from "react";

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">Game Title</div>
      <div className="navbar-auth">
        <button className="btn">Sign In</button>
        <button className="btn">Sign Up</button>
      </div>
    </nav>
  );
};

export default NavBar;
