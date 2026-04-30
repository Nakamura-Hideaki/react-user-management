// src/AppContext.tsx
import { createContext, useContext, useState } from "react"
import { type User } from "./types/User"

type AppContextType = {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
}

const AppContext = createContext<AppContextType | null>(null)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([])

  return (
    <AppContext.Provider value={{ users, setUsers }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error("AppContext未設定")
  return context
}