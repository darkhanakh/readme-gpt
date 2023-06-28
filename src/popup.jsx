import React, { useState } from "react";
import { render } from "react-dom";

import "./styles/style.css";
import "./styles/normalize.css";

const Popup = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    await chrome.tabs.sendMessage(tab.id, {
      name,
      description,
    });
  };

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
          placeholder="Project desciption"
          value={description}
          onInput={(e) => setDescription(e.target.value)}
        ></textarea>
        <button className="extension__button">Generate</button>
      </form>
    </div>
  );
};

render(<Popup />, document.getElementById("react-target"));
