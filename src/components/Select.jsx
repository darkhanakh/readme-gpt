import React from "react";

const Select = ({ optionText, options, setState, state }) => {
  return (
    <>
      <select
        className="extension__select"
        value={state}
        onChange={(e) => setState(e.target.value)}
      >
        <option disabled value="">
          {optionText}
        </option>

        {options.map((option) => {
          return <option value={option}>{option}</option>;
        })}
      </select>
    </>
  );
};

export default Select;
