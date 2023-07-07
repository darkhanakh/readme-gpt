import React, { useEffect, useState } from "react";
import { render } from "react-dom";

import "./styles/style.css";
import "./styles/normalize.css";

const Popup = () => {
  const [name, setName] = useState("");
  const [features, setFeatures] = useState("");
  const [contribution, setContribution] = useState(false);
  const [license, setLicense] = useState("");
  const [environment, setEnvironment] = useState("");
  const [extra, setExtra] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    await chrome.tabs.sendMessage(tab.id, {
      name,
      features,
      contribution,
      license,
      environment,
    });
    handleReset();
  };

  const validateForm = () => {
    if (!name || !features || !license || !environment) {
      return false;
    }
    return true;
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
        <select
          className="extension__select"
          value={license}
          onChange={(e) => setLicense(e.target.value)}
        >
          <option disabled value="">
            Select a license
          </option>
          <option value="MIT">MIT</option>
          <option value="GPLv3">GPLv3</option>
          <option value="Apache License 2.0">Apache License 2.0</option>
          <option value="The Unlicense">The Unlicense</option>
          <option value="Boost Software License 1.0">
            Boost Software License 1.0
          </option>
          <option value="Mozilla Public License 2.0">
            Mozilla Public License 2.0
          </option>
        </select>

        <select
          className="extension__select"
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
        >
          <option disabled value="">
            Select an environment
          </option>
          <option value="npm">npm</option>
          <option value="yarn">yarn</option>
          <option value="Python(pip)">Python (pip)</option>
          <option value="Python(poetry)">Python (poetry)</option>
        </select>
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
