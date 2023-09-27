'use client';

import { createContext, useState } from 'react';

export const appContext = createContext();

function AppProvider({ children }) {
  const [mealList, setMealList] = useState([]);

  return (
    <appContext.Provider value={{ mealList, setMealList }}>
      {children}
    </appContext.Provider>
  );
}

export default AppProvider;
