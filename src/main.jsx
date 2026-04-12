import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./components/context/Authcontext";
import { ThemeProvider } from "./components/context/ThemeContext";

import { Provider } from "react-redux";
import { store } from "./redux/store/store";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <ThemeProvider>
            <AppRoutes />
          </ThemeProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
