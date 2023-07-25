import Select from "./Select.jsx";
import React from "react";

const Generate = ({
  handleSubmit,
  setName,
  setFeatures,
  setContribution,
  setLicense,
  setEnvironment,
  setExtra,
  formError,
  handleReset,
  name,
  features,
  contribution,
  license,
  environment,
  extra,
}) => {
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

export default Generate;
