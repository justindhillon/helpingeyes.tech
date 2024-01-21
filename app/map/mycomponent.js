import React, { useEffect } from 'react';

const MyComponent = () => {
  useEffect(() => {
    // Ensure the MeteredFrame script is loaded before initializing
    const script = document.createElement('script');
    script.src = 'https://cdn.metered.ca/sdk/frame/1.4.3/sdk-frame.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize MeteredFrame after the script is loaded
      var frame = new MeteredFrame();
      frame.init({
        roomURL: 'helpingeyes.metered.live/1',
      }, document.getElementById('metered-frame'));
    };

    // Cleanup: remove the script tag when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array ensures useEffect runs once after initial render

  return (
    <div id="metered-frame">
      {/* MeteredFrame will be initialized here */}
    </div>
  );
};

export default MyComponent;