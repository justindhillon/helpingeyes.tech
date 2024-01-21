// navigationSetup.jsx
import React, { useState } from 'react';

function NavigationDetail({ selectedLocation }) {
  const [selected, setSelected] = useState(null);

  const handleItemClick = (location) => {
    setSelected(location);
    // You can add additional logic or navigate to a different page here
  };

  return (
    <>
      <div id="navigationBox">
        <h1>Selected Starting Location: {selectedLocation || 'None'}</h1>
      </div>
      <div id='locationNavigation'>
        <h2>Location Navigation</h2>
        <ul>
          <li onClick={() => handleItemClick(selectedLocation)}>{selectedLocation}</li>
          {/* You can add more <li> elements for other locations if needed */}
        </ul>
      </div>
    </>
  );
}

export default NavigationDetail;
