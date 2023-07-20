import { useEffect, useState } from "react";

const Content = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

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
      <h1>{token ? "We have token" : "We don't have token"}</h1>
      <button className="btn">Get user data</button>
    </div>
  );
};

export default Content;
