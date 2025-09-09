import React, { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import { checkAuth } from "./features/auth/authSlice";
import { selectTheme } from "./features/theme/themeSlice";
import AppRoutes from "./routes";
import { NotificationContainer } from "./components/Notification";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/globals.css";
import "./styles/components.css";

const App = () => {
  useEffect(() => {
    store.dispatch(checkAuth());
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

const AppContent = () => {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    if (theme) {
      document.documentElement.className = theme;
    }
  }, [theme]);

  return (
    <div className="App">
      <AppRoutes />
      <NotificationContainer />
    </div>
  );
};

export default App;
