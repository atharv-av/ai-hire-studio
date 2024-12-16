"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUser, setUser, removeUser } from "@/utils/storage";

// Define types for the user and authentication context
interface User {
  isAuth: boolean;
  id?: number | string;
  firstName?: string;
  lastName?: string;
  token?: string;
}

interface AuthContextType extends User {
  setAuth: (user: Partial<AuthContextType>) => void;
  logOut: () => void;
}

// Add placeholders for setAuth and logOut in the initial state
const initialState: AuthContextType = {
  isAuth: false,
  id: undefined,
  firstName: undefined,
  lastName: undefined,
  token: undefined,
  setAuth: () => {},
  logOut: () => {},
};

// Create the Auth Context
export const AuthContext = createContext<AuthContextType>(initialState);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthContextType>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate the auth state with the user data after the component mounts
  useEffect(() => {
    const user = getUser();
    const token = localStorage.getItem("token");
    if (token) {
      setAuthState((prevState) => ({
        ...prevState,
        ...user,
        isAuth: true,
        firstName: user?.firstName,
        lastName: user?.lastName,
      }));
    }
    setIsHydrated(true);
  }, []);

  // setAuth function to update the auth state
  const setAuth = useCallback((user: Partial<AuthContextType>) => {
    setAuthState((prevState) => ({
      ...prevState,
      ...user,
      firstName: user.firstName || prevState.firstName || "",
      lastName: user.lastName || prevState.lastName || "",
    }));
    // @ts-ignore
    setUser(user);
  }, []);

  // logOut function to clear the auth state
  const logOut = useCallback(() => {
    setAuthState(initialState); // Reset to the initial state
    removeUser(); // Clear the user from localStorage
  }, []);

  // Don't render anything until the hydration is complete
  if (!isHydrated) return null;

  return (
    <AuthContext.Provider value={{ ...authState, setAuth, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the Auth context
export const useAuth = () => useContext(AuthContext);
