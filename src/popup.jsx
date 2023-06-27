import React from "react";
import { render } from "react-dom";

import "./styles/style.css";
import "./styles/normalize.css";

const Popup = () => {
  return (
    <div className="extension">
      <h1 className="extension__title">README.md Writer</h1>
      <form className="extension__form">
        <textarea
          className="extension__textarea"
          placeholder="Project desciption"
        ></textarea>
        <button className="extension__button">Generate</button>
      </form>
    </div>
  );
};

render(<Popup />, document.getElementById("react-target"));
