import "./styles/style.css";
import "./styles/normalize.css";

import React, { useEffect, useState } from "react";
import { render } from "react-dom";

import Generate from "./components/Generate.jsx";

const Popup = () => {
  const [name, setName] = useState("");
  const [features, setFeatures] = useState("");
  const [contribution, setContribution] = useState(false);
  const [license, setLicense] = useState("");
  const [environment, setEnvironment] = useState("");
  const [extra, setExtra] = useState("");
  const [formError, setFormError] = useState("");
  const [tab, setTab] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    console.log(tab);

    await chrome.tabs.sendMessage(tab.id, {
      name,
      features,
      contribution,
      license,
      environment,
      tab,
      action: "generate-readme",
    });
    handleReset(e);
  };

  const validateForm = () => {
    return !(!name || !features || !license || !environment);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setName("");
    setFeatures("");
    setContribution(false);
    setLicense("");
    setEnvironment("");
    setExtra("");
    setFormError("");
  };

  const handleLogout = () => {
    chrome.cookies.remove({
      url: "https://readme-gpt-lemon.vercel.app/",
      name: "extension-github-token",
    });
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    chrome.tabs.create({ url: "https://readme-gpt-lemon.vercel.app/" });
  };

  useEffect(() => {
    const getCurrentTab = async () => {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      setTab(tabs[0]);
    };

    // Load the state variables from storage.local
    chrome.storage.local.get(
      ["name", "features", "contribution", "license", "environment", "extra"],
      (result) => {
        setName(result.name || "");
        setFeatures(result.features || "");
        setContribution(result.contribution || false);
        setLicense(result.license || "");
        setEnvironment(result.environment || "");
        setExtra(result.extra || "");
        console.log(result);
      }
    );

    getCurrentTab();
  }, []);

  useEffect(() => {
    chrome.cookies.get(
      {
        url: "https://readme-gpt-lemon.vercel.app/",
        name: "extension-github-token",
      },
      function (cookie) {
        if (cookie) {
          setIsLoggedIn(true);
        }
      }
    );

    // Save the state variables to storage.local
    chrome.storage.local.set(
      {
        name,
        features,
        contribution,
        license,
        environment,
        extra,
      },
      function () {
        console.log("Saved");
      }
    );
  }, [name, features, contribution, license, environment, extra]);

  return (
    <>
      {isLoggedIn ? (
        <Generate
          name={name}
          license={license}
          features={features}
          formError={formError}
          contribution={contribution}
          environment={environment}
          setName={setName}
          setFeatures={setFeatures}
          setContribution={setContribution}
          setLicense={setLicense}
          setEnvironment={setEnvironment}
          setExtra={setExtra}
          handleReset={handleReset}
          handleSubmit={handleSubmit}
          handleLogout={handleLogout}
        />
      ) : (
        <>
          <div className="extension">
            <h1 className="extension__title">README.md Writer</h1>
            <button className="extension__login-button" onClick={handleLogin}>
              Login
            </button>
          </div>
        </>
      )}
    </>
  );
};

render(<Popup />, document.getElementById("react-target"));
