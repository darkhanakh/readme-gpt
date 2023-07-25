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

        {options.map((option, index) => {
          return (
            <option value={option} key={index}>
              {option}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default Select;
