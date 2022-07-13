import React, { useContext, useState } from 'react'

export const userdetails = {
  signin_details: {
   session:null,
  },
  subscription_details: {
    status:'inactive',
  },
}

export const UserContext = React.createContext({
  user: undefined,
  setUser: async (user) => null,
})

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(userdetails)

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}