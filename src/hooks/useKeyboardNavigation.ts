// src/hooks/useKeyboardNavigation.ts
//  キーの処理
import { useEffect } from "react"
import { type User } from "../types/User"

export const useKeyboardNavigation = ({
  users,            //  検索・ソート済み
  selectedId,
  itemsPerPage,
  onMove,
  onEnter,
}: {
    users:User[],
    selectedId:number|null,
    itemsPerPage:number,
    onMove: (id: number, page: number) => void,
    onEnter: (id: number) => void,
}) => {

  //  キー操作（選択行の移動、確定）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const sortedUsers = users

      if (!selectedId) return
      if (e.repeat) return    //  長押し常に無効
      //  INPUTフォーカス中は、キー操作（↑、↓、Enter）を無効にする
      if ((e.target as HTMLElement).tagName === "INPUT") return

      const selectIndex = sortedUsers.findIndex(user => user.id === selectedId)
      if (selectIndex === -1) return

      //  決定キー
      if (e.key === "Enter") {
        //  他のボタンの押下を禁止
        e.preventDefault()
        e.stopPropagation()

        const selectUser = sortedUsers[selectIndex]
        onEnter(selectUser.id) 
        return
      }

      let newIndex = selectIndex
      //  下キー
      if (e.key === "ArrowDown") {
        e.preventDefault()   // 
        newIndex = Math.min(selectIndex + 1, sortedUsers.length - 1)
      }
      //  上キー
      if (e.key === "ArrowUp") {
        e.preventDefault()   // 
        newIndex = Math.max(selectIndex - 1, 0)
      }

      //  上下キーで選択行が移動した場合(両端以外は移動する)、選択行を更新
      if (newIndex !== selectIndex) {
        const id = sortedUsers[newIndex].id
        const newPage = Math.floor(newIndex / itemsPerPage) + 1
        onMove(id, newPage) 
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [users, selectedId, itemsPerPage, onMove, onEnter]) 
}
