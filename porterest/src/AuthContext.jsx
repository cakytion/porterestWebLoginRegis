import React, { createContext, useState, useEffect, useContext } from "react";

// create context for auth
const AuthContext = createContext(null);

// create component that wraps other components
export function AuthProvider({ children }) {
  // useState returns the state variable, and its setter function, which we use to update the associated state variable
  const [user, setUser] = useState(null);
  // set isLoading value initially to 'true'
  const [isLoading, setIsLoading] = useState(true);

  // the first parameter is the function (effect), the second is a dependency array for rerunning the effect function (empty, so just run only once in this case)
  useEffect(() => {
    const checkUserSession = async () => {
      // get user profile from backend
      try {
        const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/profile`;
        const response = await fetch(apiUrl, {
          credentials: "include", // send session jwt cookie too
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // bundled value we want to broadcast to children
  const value = {
    user,
    setUser,
    isLoading,
  };

  // .Provider is a special component. now nested components can use useContext to get the value here broadcasted
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// a convenient helper function to consume saved context
export function useAuth() {
  return useContext(AuthContext);
}
