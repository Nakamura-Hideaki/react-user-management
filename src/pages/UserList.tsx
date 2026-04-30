// src/pages/UserList.tsx
//  一覧作成
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUsers } from "../hooks/useUsers"
import { useQueryParams } from "../hooks/useQueryParams"
import { SearchBox } from "../components/SearchBox"
import { UserForm } from "../components/UserForm"
import { UserTable } from "../components/UserTable"
import { Pagination } from "../components/Pagination"
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation"


export const UserList = () => {
  const { users, loading, error, loadUsers, addUser, removeUser  } = useUsers()
  const { searchParams, updateParams } = useQueryParams()
  const [lastAddedId, setLastAddedId] = useState<number | null>(null)
  const search = searchParams.get("search") || ""
  const sortKey = (searchParams.get("sortKey") as "id" | "name") || "id"
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc"
  const page = Number(searchParams.get("page")) || 1
  const selectedIdParam = searchParams.get("selectedId")
  const selectedId = selectedIdParam ? Number(selectedIdParam) : null
  const navigate = useNavigate()
  const targetIdParam = searchParams.get("targetId")
  const targetId = targetIdParam ? Number(targetIdParam) : null

  const itemsPerPage = 4

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.includes(search) || user.email.includes(search)
    )
  }, [users, search])

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (sortKey === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      }
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id
    })
  }, [filteredUsers, sortKey, sortOrder])

  useEffect(() => {
    if (!selectedId) return

    const selectIndex = sortedUsers.findIndex(user => user.id === selectedId)
    if (selectIndex === -1) {
      updateParams({
        selectedId: (selectIndex === -1)? "" : String(sortedUsers[selectIndex].id),
      })
    }
  }, [sortedUsers])

  useEffect(() => {
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)

    // ページが存在しない場合は補正
    if (page > totalPages && totalPages > 0) {
      updateParams({
        page: String(totalPages),
        selectedId: "",
      })
    }
    // 0件になった場合の補正
    if (totalPages === 0) {
      updateParams({
        page: "1",
        selectedId: "",
      })
    }

  }, [sortedUsers.length])

  //  追加・編集時のページ更新処理
  useEffect(() => {
    if (!targetId && !lastAddedId) return

    const id = targetId ?? lastAddedId
    if (!id) return

    const index = sortedUsers.findIndex(u => u.id === id)
    if (index === -1) return

    const page = Math.floor(index / itemsPerPage) + 1
    updateParams({
      selectedId: String(id),
      page: String(page),
      targetId: "",   // ← 使い終わったら消す
    })
    setLastAddedId(null)
  }, [sortedUsers])

  useKeyboardNavigation({
    users:sortedUsers,
    selectedId,
    itemsPerPage,
    onMove: (id, page) => {
      updateParams({
        selectedId: String(id),
        page: String(page),
      })
    },
    onEnter: (id) => {
      navigate(`/users/${id}?${searchParams.toString()}`)
    },
  })

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)   //  全ページ数（データが無い場合は、無いことを通知するため、０は０で通知）

  if (loading) return <p>Loading...</p>
  if (error) return <p>読込み中に、エラーが発生しました</p>   //  読込み中のエラー発生の場合、
  return (
    <div className="app-container">
      <div className="app-header">
        ユーザー一覧
      </div>
      <div className="control-bar">
        {/*  検索処理 */}
        <SearchBox
          value={search}
          onChange={(value) => updateParams({ search: value, page: "1", selectedId: ""})}
        />
        {/*  追加処理 */}
        <UserForm
          onAdd={async (name, email) => {
            const user = await addUser(name, email)
            setLastAddedId(user.id)
          }}
        />
      </div>
      <div className="table-container">
        {/*  表（データ） */}
        <UserTable
          users={sortedUsers}     //  検索してソートした結果のデータを渡す
          onDelete={removeUser}
          pageMax={itemsPerPage}
          selectId={selectedId}
          updateSelectID={(id) => updateParams({ selectedId: String(id) })}
          updateSortParam={(key,order) => updateParams({ 
            sortKey: key,
            sortOrder: order,
            page: "1",
            selectedId: "", 
          })}
        />
      </div>
      <div className="pagination">
        {/*  ページ切り替え */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={(p: number) => updateParams({ page: String(p) })}
        />
      </div>
    </div>
  )
}
