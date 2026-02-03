"use client";

import { useState, useEffect } from 'react';
import styles from './CustomNumberInput.module.css';

const CustomNumberInput = ({ value, onChange, min = 1, max = 20 }) => {
  const [inputValue, setInputValue] = useState(value || min);

  useEffect(() => {
    setInputValue(value || min);
  }, [value, min]);

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value) || min;
    const clampedValue = Math.min(Math.max(newValue, min), max);
    setInputValue(clampedValue);
    onChange(clampedValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(inputValue + 1, max);
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(inputValue - 1, min);
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    }
  };

  return (
    <div className={styles.numberInputContainer}>
      <button
        type="button"
        className={`${styles.stepperButton} ${styles.decrementButton}`}
        onClick={handleDecrement}
        disabled={inputValue <= min}
        aria-label="Decrease value"
      >
        −
      </button>
      
      <input
        type="number"
        min={min}
        max={max}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={styles.numberInput}
        aria-label="Quantity"
      />
      
      <button
        type="button"
        className={`${styles.stepperButton} ${styles.incrementButton}`}
        onClick={handleIncrement}
        disabled={inputValue >= max}
        aria-label="Increase value"
      >
        +
      </button>
    </div>
  );
};

export default CustomNumberInput;
