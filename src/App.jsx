import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Statistics from "./pages/Statistics.jsx";
import Profile from "./pages/Profile.jsx";
import { darkTheme, lightTheme } from "./theme";

function App() {
  const [isLightMode, setIsLightMode] = useState(false);
  const theme = isLightMode ? lightTheme : darkTheme;

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={<Dashboard theme={theme} toggleTheme={() => setIsLightMode(!isLightMode)} />}
      />
      <Route
        path="/statistics"
        element={<Statistics theme={theme} toggleTheme={() => setIsLightMode(!isLightMode)} />}
      />
      <Route
        path="/profile"
        element={<Profile theme={theme} toggleTheme={() => setIsLightMode(!isLightMode)} />}
      />
      <Route
        path="/"
        element={<Dashboard theme={theme} toggleTheme={() => setIsLightMode(!isLightMode)} />}
      />
    </Routes>
  );
}

export default App;

