import React, { useContext, useState } from 'react'

export const userdetails = {
  signin_details: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  subscription_details: {
    foreground: '#ffffff',
    background: '#222222',
  },
}

export const ThemeContext = React.createContext({
  theme: undefined,
  setTheme: async (theme) => null,
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(userdetails)

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}