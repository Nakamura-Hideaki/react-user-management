//  src/api/usersApi.ts
import { type User } from "../types/User"
const BASE_URL = "https://jsonplaceholder.typicode.com/users"

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error("取得失敗")
  return res.json()
}

export const createUser = async (user: Omit<User, "id">) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
  if (!res.ok) throw new Error("追加失敗")
  return res.json()
}

export const updateUser = async (user: User) => {
  const res = await fetch(`${BASE_URL}/${user.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
  if (!res.ok) throw new Error("更新失敗")
  return res.json()
}

export const deleteUser = async (id: number) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("削除失敗")
}
