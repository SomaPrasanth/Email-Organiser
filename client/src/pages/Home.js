import React from 'react';
import axios from 'axios';
import "../styles/index.css";


function Home() {
  const handleLogin = async () => {
    try {
      console.log("hello");
      const res = await axios.get('http://localhost:5000/auth/url');
      window.location.href = res.data.url; // Redirect to Google login
    } catch (err) {
      console.error('Failed to get auth URL', err);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Email Organizer</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}

export default Home;
