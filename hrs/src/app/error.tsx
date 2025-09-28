'use client';

import { useEffect } from 'react';

type ErrorProps = {
  error: Error;
  reset: () => void;
};

const AboutErrorPage = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    console.error("Error in About page:", error);
  }, [error]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Something went wrong on the About page!</h1>
      <p>We're sorry, but there was an issue loading this page.</p>
      <button onClick={() => reset()} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Go Back
      </button>
    </div>
  );
};

export default AboutErrorPage;
