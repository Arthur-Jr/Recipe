'use client';

import { createContext, useState } from 'react';

export const appContext = createContext();

function AppProvider({ children }) {
  const [mealList, setMealList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <appContext.Provider value={{ mealList, setMealList, isLoading, setIsLoading }}>
      {children}
    </appContext.Provider>
  );
}

export default AppProvider;
