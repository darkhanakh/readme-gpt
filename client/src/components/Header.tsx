import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

const Header = () => {
  const [cookies] = useCookies(["extension-github-token"]);

  return (
    <>
      <div className="navbar bg-base-10">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            README-GPT
          </Link>
        </div>
        <div className="flex-none">
          {!cookies["extension-github-token"] && (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
