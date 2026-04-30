// src/UserDetail.tsx
import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useAppContext } from "./AppContext"
import { updateUser } from "./api/usersApi"

export const UserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const { users, setUsers } = useAppContext()
  const user = users.find((u) => u.id === Number(id)) || null
  const location = useLocation()

  useEffect(() => {
    if (!user) return
    setEditName(user.name)
    setEditEmail(user.email)
  }, [user])

  //  共通の戻る処理
  const keyOnEsc = () => {
    navigate(-1)
  }

  // 更新処理
  const handleUpdate = async () => {
    if (!user) return

    const updated = {
      ...user,
      name: editName,
      email: editEmail,
    }

    try {
      await updateUser(updated)
    } catch(e) {
      console.warn("更新失敗：APIはダミーなので無視", e)
      //alert("更新失敗")
    }
    setUsers(users.map((u) => ( u.id === user.id ? updated : u)))

    const params = new URLSearchParams(location.search)
    params.set("targetId", String(user.id))
    navigate("/?" + params.toString())
  }

  //  キー操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        keyOnEsc()
        return
      }
      if (e.key === "Enter") {
        e.preventDefault()
        handleUpdate()
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleUpdate, keyOnEsc])

  if (!user) return <p>データなし</p>

  return (
    <>
      <button onClick={() => 
        //navigate("/" + location.search)
        keyOnEsc()
      }>
        戻る
      </button>

      <h2>詳細</h2>
      <p>ID: {user.id}</p>

      <div>
        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
      </div>

      <div>
        <input
          value={editEmail}
          onChange={(e) => setEditEmail(e.target.value)}
        />
      </div>

      <button onClick={handleUpdate}>保存</button>
    </>
  )
}
