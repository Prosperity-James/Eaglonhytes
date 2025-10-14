import React, { createContext, useState, useContext, useEffect } from "react";
import api, { endpoints } from "../utils/api";

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  refreshUser: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user session on initial load with better error handling
    const checkSession = async () => {
      try {
        console.log('🔍 Checking session...');
        
        // Simple timeout using Promise.race
        const sessionPromise = api.get(endpoints.session);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        );
        
        const data = await Promise.race([sessionPromise, timeoutPromise]);
        
        console.log('📋 Session data:', data);
        console.log('🔍 data.success:', data.success);
        console.log('🔍 data.user:', data.user);
        console.log('🔍 data.message:', data.message);
        
        if (data.success && data.user) {
          console.log('✅ Session valid, user logged in:', data.user.full_name);
          setUser(data.user);
        } else {
          console.log('❌ No valid session found - Reason:', data.message || 'Unknown');
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Error checking session:", error);
        console.log("🔄 Setting user to null to continue app loading...");
        // Don't crash the app - just set user to null
        setUser(null);
      }
    };

    // Add a small delay to ensure the app renders first
    const timeoutId = setTimeout(checkSession, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const login = (userData) => {
    console.log("🔐 AuthContext login called with:", userData);
    setUser(userData);
    console.log("✅ User state updated in AuthContext");
  };

  const logout = async () => {
    try {
      const data = await api.post(endpoints.logout, {});
      if (data.success) {
        setUser(null);
        window.location.href = "/";
      } else {
        console.error("Logout failed:", data.message);
        setUser(null);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging out:", error);
      // Still clear user state even if network fails
      setUser(null);
      window.location.href = "/";
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
  };

  const refreshUser = async () => {
    try {
      const data = await api.get(endpoints.session);
      if (data.success) {
        setUser(data.user);
        return data.user;
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
