'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Redirect to the rectified landing page if it exists as a static file,
    // or we could just inject the HTML here.
    window.location.href = '/index.html'; 
  }, []);

  return (
    <div style={{ backgroundColor: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f2ff', fontFamily: 'monospace' }}>
      🌌 Humanese Sovereign Matrix Initializing...
    </div>
  );
}
