// pages/NavPage.tsx
import React from "react";
import { Link } from "react-router-dom";

const NavPage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Navigation Page</h1>
      <Link to="/game">
        <button>Go to Game Page</button>
      </Link>
    </div>
  );
};

export default NavPage;
