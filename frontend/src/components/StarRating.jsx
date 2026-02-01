import { useState } from "react";
import "./star.css";

export default function StarRating({ value = 0, onRate, disabled = false }) {
  const [hover, setHover] = useState(0);

  const handleClick = (star) => {
    if (!disabled && onRate) {
      onRate(star);
    }
  };

  return (
    <div className={`stars ${disabled ? "disabled" : ""}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hover || value);
        
        return (
          <span
            key={star}
            className={`star ${isActive ? "active" : ""}`}
            onMouseEnter={() => !disabled && setHover(star)}
            onMouseLeave={() => !disabled && setHover(0)}
            onClick={() => handleClick(star)}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={`Rate ${star} stars`}
            onKeyDown={(e) => {
              if (!disabled && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                handleClick(star);
              }
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}