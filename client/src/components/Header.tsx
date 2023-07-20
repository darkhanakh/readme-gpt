import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <div className="navbar bg-base-10">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            README-GPT
          </Link>
        </div>
        <div className="flex-none">
          <>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
          </>
        </div>
      </div>
    </>
  );
};

export default Header;
