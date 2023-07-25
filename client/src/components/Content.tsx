import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

interface GithubUserData {
  avatar_url?: string;
  login?: string;
}

const Content = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState<GithubUserData>({});
  const [cookies, setCookie, removeCookie] = useCookies([
    "extension-github-token",
  ]);

  const getUserData = async () => {
    const response = await fetch("http://localhost:4000/getUser", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setUserData(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    removeCookie("extension-github-token");
  };

  useEffect(() => {
    const codeParam = new URLSearchParams(window.location.search).get("code");

    if (codeParam && !token) {
      const getAccessToken = async () => {
        try {
          const response = await fetch(
            "http://localhost:4000/getAccessToken?code=" + codeParam
          );
          const data = await response.json();
          console.log(data);
          if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            setToken(data.access_token);
            setCookie("extension-github-token", data.access_token, {
              path: "/",
            });
          }
        } catch (error) {
          console.error("Error fetching access token:", error);
        }
      };
      getAccessToken();
    }
  }, [token]);

  return (
    <div>
      {token ? (
        <>
          {cookies["extension-github-token"]}
          <button onClick={getUserData} className="btn">
            Get user data
          </button>
          <button onClick={logout} className="btn">
            Logout
          </button>
          {Object.keys(userData).length > 0 && (
            <>
              <div>Hey there {userData.login}</div>
              <img
                src={userData.avatar_url}
                alt="avatar"
                width="100px"
                height="100px"
              />
            </>
          )}
        </>
      ) : (
        <>
          <h3>User is not logged in</h3>
        </>
      )}
    </div>
  );
};

export default Content;
