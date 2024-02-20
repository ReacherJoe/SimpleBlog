import React from 'react';

const SeeMore = ({ text, onSeeMoreClick }) => {
  const handleSeeMore = () => {
    onSeeMoreClick();
  };

  return (
    <>
      <p>{text.length > 15 ? text.substring(0, 15) : text}</p> {/* Display truncated text if length > 15 */}
      {text.length > 15 && <button onClick={handleSeeMore}>See More</button>} {/* Render button only if length > 15 */}
    </>
  );
};

export default SeeMore;
