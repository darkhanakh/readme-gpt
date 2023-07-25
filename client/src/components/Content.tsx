import { useEffect } from "react";
import { useCookies } from "react-cookie";

const Content = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "extension-github-token",
  ]);

  const token = cookies["extension-github-token"];

  const logout = () => {
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
  }, [token, setCookie]);

  return (
    <div>
      {token ? (
        <>
          <div className="flex flex-col items-center justify-center h-96">
            <h1 className="text-4xl mb-5">You are successfully logged in</h1>
            <button onClick={logout} className="btn">
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center h-96">
            <h3 className="text-4xl">You are not logged in</h3>
          </div>
        </>
      )}
    </div>
  );
};

export default Content;
