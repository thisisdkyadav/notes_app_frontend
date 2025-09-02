import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  isVerified: boolean
  profilePicture?: string
  authProvider?: "email" | "google"
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (userData: User, token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem("authToken")
    const storedUser = localStorage.getItem("authUser")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem("authToken", authToken)
    localStorage.setItem("authUser", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")
  }

  const isAuthenticated = !!user && !!token

  return <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>{children}</AuthContext.Provider>
}
