// src/components/UserTable.tsx
//  表（データのテーブル管理）
import { useEffect, useRef } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { type User } from "../types/User"

export const UserTable = ({
  users,          //  検索・ソート済み
  onDelete,
  pageMax,
  selectId,
  updateSelectID,
  updateSortParam,
}: {
  users:User[],
  onDelete:(id: number) => void,
  pageMax:number,
  selectId:number|null,
  updateSelectID:(id: number) => void,
  updateSortParam:(key: string, order: string) => void,
}) => {

  //  Reactで管理（前回の値を引き継ぐ）
  const [searchParams] = useSearchParams()

  //  render実行時、毎回計算（ただし元データはURLなので“状態に準ずる”）
  const sortKey = (searchParams.get("sortKey") as "id" | "name") || "id"
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc"
  const currentPage = Number(searchParams.get("page")) || 1

  //  完全にローカルな固定値（毎回同じ）
  const itemsPerPage = pageMax    //  1ページの最大表示件数（UserList.tsxの定義を参照）
  const selectedId = selectId

  const startIndex = (currentPage - 1) * itemsPerPage


  // -----------------------------
  // 最新値をRefで保持（keydown用）
  // -----------------------------
  const selectedIdRef = useRef(selectedId)
  const sortedUsersRef = useRef(users)
  const searchParamsRef = useRef(searchParams)

  useEffect(() => { selectedIdRef.current = selectedId }, [selectedId])
  useEffect(() => { sortedUsersRef.current = users }, [users])
  useEffect(() => { searchParamsRef.current = searchParams }, [searchParams])


  //  今回表示用の1ページ分
  const paginatedUsers = users.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  //  ソート処理（画面操作と連動の為、必ず更新して問題なし）
  const handleSort = (key: "id" | "name") => {
    const newOrder = (sortKey === key && sortOrder === "asc") ? "desc" : "asc"
    updateSortParam(key, newOrder)
  }
  
  return (
    <>
      {users.length === 0 && <p>検索結果：該当データなし</p>}
      {/*  一覧データ（全件）テーブル作成　（className="user-table"で罫線を記載） */}
      {users.length > 0 && (
        <table className="user-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>
                ID {sortKey === "id" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("name")}>
                名前 {sortKey === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th>Email</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {/*  選択行の色変更 */}
            {paginatedUsers.map((user) => (
              <tr
                key={`${user.id}-${selectedId}`}
                onClick={() => updateSelectID(user.id)}
                className={`user-row ${user.id === selectedId ? "selected" : ""}`}
              >
                <td>{user.id}</td>
                <td>
                  <Link
                    to={`/users/${user.id}?${new URLSearchParams({
                      ...Object.fromEntries(searchParams),
                      selectedId: String(user.id),
                    }).toString()}`}
                    onClick={(e) => {
                      e.stopPropagation()         // ← 遷移阻害防止
                    }}
                  >
                    {user.name}
                  </Link>
                  </td>
                <td>{user.email}</td>
                <td>
                  <button onClick={(e) => {
                    e.stopPropagation()
                    onDelete(user.id)
                  }}>
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
