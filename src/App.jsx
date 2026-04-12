import "./App.css";
import "./index.css";
import Approuter from "./components/layout/Approuter";
import Loader from "./components/common/Loader";
import { useAuth } from "./components/context/Authcontext";
import { useState, useEffect } from "react";

function App() {
  const { isAuthenticated } = useAuth();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setShowLoader(true);
      const timer = setTimeout(() => setShowLoader(false), 1200);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [isAuthenticated]);

  if (showLoader) return <Loader />;

  return (
    <>
      <Approuter />
    </>
  );
}

export default App;
