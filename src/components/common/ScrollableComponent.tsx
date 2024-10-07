import React from 'react';
import './CustomScrollbar.css';  // Import the updated CSS file

const ScrollableComponent = () => {
  return (
    <div className="custom-scrollbar" style={{ height: '400px', overflowY: 'scroll' }}>
      <div style={{ height: '1000px' }}>
        {/* Your content here */}
        Scroll me with an oval blue scrollbar!
      </div>
    </div>
  );
};

export default ScrollableComponent;
