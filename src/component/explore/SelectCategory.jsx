import React, { useState } from "react";
import "./SelectCategory.css";
const Login_URL = import.meta.env.VITE_APP_URL;
function SelectCategory({ categories, checkBoxState, handleCheckBox }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleCategoryClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="select-category_container">
      <h4 onClick={handleCategoryClick}>Category</h4>
      <div className={isOpen ? "open" : ""}>
        {categories.map((cat) => (
          <span key={cat} className="category-option">
            <input
              type="checkbox"
              id={`category-${cat}`}
              name={cat}
              checked={checkBoxState[cat] || false}
              onChange={handleCheckBox}
            />
            <label htmlFor={`category-${cat}`}>{cat}</label>
          </span>
        ))}
      </div>
      <div className="auth-buttons-container">
        <button
          className="auth-buttons"
          onClick={() =>
            (window.location.href = `${Login_URL}/auth/signin`)
          }
        >
          Login
        </button>
        <button
          className="auth-buttons"
          onClick={() =>
            (window.location.href = `${Login_URL}/auth/signup`)
          }
        >
          Register
        </button>
        <button className="auth-buttons" onClick={()=>(window.location.href = `${Login_URL}/auth/logout`)}>Logout</button>
      </div>
    </div>
  );
}

export default SelectCategory;
