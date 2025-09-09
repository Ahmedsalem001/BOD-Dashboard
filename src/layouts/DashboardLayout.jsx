import React, { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { useNotifications } from "../components/Notification";
import { usePreload } from "../hooks/usePerformance";
import ThemeToggle from "../components/ThemeToggle";
import Icon from "../components/Icon";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { showSuccess } = useNotifications();

  // redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      showSuccess("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [dispatch, showSuccess, navigate]);

  const navigation = useMemo(
    () => [
      {
        name: "Dashboard",
        href: "/",
        icon: "dashboard",
        current: location.pathname === "/",
      },
      {
        name: "Posts",
        href: "/posts",
        icon: "posts",
        current: location.pathname === "/posts",
      },
      {
        name: "Users",
        href: "/users",
        icon: "users",
        current: location.pathname === "/users",
      },
    ],
    [location.pathname]
  );

  const getIcon = useCallback(
    (iconName) => <Icon name={iconName} className="w-5 h-5" />,
    []
  );

  // Preload other pages for better performance
  usePreload(() => import("../pages/Posts"), []);
  usePreload(() => import("../pages/Users"), []);

  if (!isAuthenticated) {
    return null; // will redirect to login
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 flex z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" />
        </div>
      )}

      {/* sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-primary-600">
          <h1 className="text-xl font-bold text-white">BOD Dashboard</h1>
          <button
            className="md:hidden text-white hover:text-gray-200"
            onClick={() => setSidebarOpen(false)}
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  item.current
                    ? "bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-300"
                    : "border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                } group flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors duration-200`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3">{getIcon(item.icon)}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* user section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              title="Logout"
            >
              <Icon name="logout" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* top bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              className="md:hidden text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setSidebarOpen(true)}
            >
              <Icon name="menu" className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {navigation.find((item) => item.current)?.name || "Dashboard"}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* notifications */}
              <button
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 relative"
                onClick={() =>
                  showSuccess("Notifications feature coming soon!")
                }
                title="Notifications"
              >
                <Icon name="notification" className="w-6 h-6" />
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* user menu */}
              <div className="relative">
                <button className="flex items-center text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
