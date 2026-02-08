import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  phone: string;
  name: string;
  mainBalance: number;
  referralBalance: number;
  investedAmount: number;
  totalProfit: number;
  lastBonusClaim: string | null;
  referralCode: string;
}

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  showBonusPopup: boolean;
  showChannelPopup: boolean;
  login: (phone: string) => void;
  signup: (phone: string, name: string) => void;
  logout: () => void;
  adminLogin: () => void;
  adminLogout: () => void;
  claimDailyBonus: () => void;
  closeBonusPopup: () => void;
  closeChannelPopup: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showBonusPopup, setShowBonusPopup] = useState(false);
  const [showChannelPopup, setShowChannelPopup] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(true);

  const login = (phone: string) => {
    setUser({
      phone,
      name: 'User',
      mainBalance: 0,
      referralBalance: 0,
      investedAmount: 0,
      totalProfit: 0,
      lastBonusClaim: null,
      referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    });
    setIsLoggedIn(true);
    if (isFirstLogin) {
      setTimeout(() => setShowChannelPopup(true), 500);
      setIsFirstLogin(false);
    }
  };

  const signup = (phone: string, name: string) => {
    setUser({
      phone,
      name,
      mainBalance: 1500,
      referralBalance: 0,
      investedAmount: 0,
      totalProfit: 0,
      lastBonusClaim: null,
      referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    });
    setIsLoggedIn(true);
    setShowBonusPopup(true);
    setTimeout(() => {
      setShowChannelPopup(true);
    }, 1500);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const adminLogin = () => {
    setIsAdmin(true);
  };

  const adminLogout = () => {
    setIsAdmin(false);
  };

  const claimDailyBonus = () => {
    if (user) {
      setUser({
        ...user,
        mainBalance: user.mainBalance + 50,
        lastBonusClaim: new Date().toISOString(),
      });
    }
  };

  const closeBonusPopup = () => setShowBonusPopup(false);
  const closeChannelPopup = () => setShowChannelPopup(false);

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn,
        isAdmin,
        showBonusPopup,
        showChannelPopup,
        login,
        signup,
        logout,
        adminLogin,
        adminLogout,
        claimDailyBonus,
        closeBonusPopup,
        closeChannelPopup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
