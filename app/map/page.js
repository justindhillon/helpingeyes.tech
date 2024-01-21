"use client"

import React from 'react';
import dynamic from 'next/dynamic';
import MyComponent from './mycomponent'; // Adjust the path based on your project structure

const MapComponent = dynamic(() => import('./map'), { ssr: false });
const LocationList = dynamic(() => import('./location'), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6">
      <MyComponent />
      <div className='mapBox'>
        <div id='app'>
          <MapComponent />
        </div>
        <LocationList />
      </div>
    </main>
  );
}
