// src/components/UserForm.tsx
//  追加機能
import { useState } from "react"

export const UserForm = ({ onAdd }: {
  onAdd: (name: string, email: string) => void
}) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  return (
    <div>
      <input placeholder="名前" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={() => {
        if (!name.trim() || !email.trim()) return
        onAdd(name, email)
        setName("")
        setEmail("")
      }}>
        追加
      </button>
    </div>
  )
}
