// src/hooks/useUsers.ts
import { useState } from "react"
import { useAppContext } from "../AppContext"
import { fetchUsers, createUser, deleteUser } from "../api/usersApi"

export const useUsers = () => {
  const { users, setUsers } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadUsers = async () => {
    if (users.length > 0) {
      setLoading(false)
      return
    }

    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (e) {
      console.error(e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const addUser = async (name: string, email: string) => {
    const res = await createUser({ name, email })

    const newUser = {
      ...res,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    }

    setUsers(prev => [...prev, newUser])
    return newUser
  }

  const removeUser = async (id: number) => {
    await deleteUser(id)
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  return {
    users,
    loading,
    error,
    loadUsers,
    addUser,
    removeUser,
  }
}
