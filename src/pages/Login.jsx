import React from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const loginWithGoogle = () => {
    console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <div style={styles.container}>
      {/* <h1>Habit Tracker</h1>
      <p>Build habits. Track progress.</p> */}

      <button onClick={loginWithGoogle} style={styles.button}>
        <img
          src="/google.svg"
          alt="Google"
          style={styles.googleIcon}
        />
        Sign in with Google
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",

    /* ✅ SVG background added */
    backgroundImage: "url('/logo.svg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

button: {
  padding: "12px 20px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "6px",
  border: "1px solid #14b8a6",
  backgroundColor: "#cbcbcb",

  display: "flex",
  alignItems: "center",
  gap: "10px",

  marginTop: "420px", // 👈 move button down
  marginLeft:"-1000px"

},


  googleIcon: {
    width: "20px",
    height: "20px",
  },
};
