// src/components/Pagination.tsx
//  ページ切り替え機能

export const Pagination = ({
  currentPage,
  totalPages,
  onChange,           //  ページ切り替え処理
}: {currentPage : number , totalPages: number, onChange: (page: number) => void}) => {
  return (
    <>
      {totalPages > 0 && (
        <div>
          <button
            onClick={() => {
              onChange(currentPage - 1)
            }}
            disabled={currentPage <= 1}
          >
            前
          </button>
          {"　"}{currentPage} / {totalPages}{"　"}
          <button 
            onClick={() => {
              onChange(currentPage + 1)
            }}
            disabled={currentPage >= totalPages}
          >
            次
          </button>
        </div>
      )}
    </>
  )
}
