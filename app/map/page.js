import React from 'react';
import dynamic from 'next/dynamic';
import Test from './testing'
import LocationList from './location';

const MapComponent = dynamic(() => import('./map'), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className='mapBox'>
        <LocationList />
        <div id='app'>
          <MapComponent />
        </div>
      </div>
      {/* <Test /> */}
    </main>
  );
}
