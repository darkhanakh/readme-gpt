import "./styles/style.css";
import "./styles/normalize.css";

import React, { useEffect, useState } from "react";
import { render } from "react-dom";

import Select from "./components/Select.jsx";

const Popup = () => {
  const [name, setName] = useState("");
  const [features, setFeatures] = useState("");
  const [contribution, setContribution] = useState(false);
  const [license, setLicense] = useState("");
  const [environment, setEnvironment] = useState("");
  const [extra, setExtra] = useState("");
  const [formError, setFormError] = useState("");
  const [tab, setTab] = useState({});

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
    <div className="extension">
      <h1 className="extension__title">README.md Writer</h1>
      <form className="extension__form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Project name"
          className="extension__input"
          onInput={(e) => setName(e.target.value)}
        />
        <textarea
          className="extension__textarea"
          placeholder="Project features"
          value={features}
          onInput={(e) => setFeatures(e.target.value)}
        ></textarea>
        <div className="extension__contribution">
          <label className="extension__contribution-label">
            <span className="extension__contribution-text">
              Is project open to contribution?
            </span>
            <input
              type="checkbox"
              checked={contribution}
              onChange={(e) => setContribution(e.target.checked)}
              className="extension__contribution-checkbox"
            />
          </label>
        </div>

        <Select
          options={[
            "MIT",
            "GPLv3",
            "Apache License 2.0",
            "The Unlicense",
            "Boost Software License 1.0",
            "Mozilla Public License 2.0",
          ]}
          optionText="Select a license"
          setState={setLicense}
          state={license}
        />

        <Select
          options={[
            "npm",
            "yarn",
            "Python (pip)",
            "Python (poetry)",
            "No environment",
          ]}
          optionText="Select an environment"
          setState={setEnvironment}
          state={environment}
        />

        <textarea
          className="extension__textarea"
          placeholder="Extra information"
          value={extra}
          onInput={(e) => setExtra(e.target.value)}
        ></textarea>
        {formError && (
          <div className="extension__form-error">
            <span>{formError}</span>
          </div>
        )}
        <button className="extension__button" type="submit">
          Generate
        </button>
        <button
          className="extension__button extension__button--reset"
          onClick={handleReset}
        >
          Reset
        </button>
      </form>
    </div>
  );
};

render(<Popup />, document.getElementById("react-target"));
