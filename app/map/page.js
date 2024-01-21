import React from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./map'), { ssr: false });
const LocationList = dynamic(() => import('./location'), { ssr: false });

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className='mapBox'>
        <div id='app'>
          <MapComponent />
        </div>
        <LocationList />
      </div>
    </main>
  );
}
