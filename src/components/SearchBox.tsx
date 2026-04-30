// src/components/SearchBox.tsx
//  検索機能

export const SearchBox = ({ value, onChange }: {
  value: string
  onChange: (v: string) => void
}) => (
  <input
    type="text"
    placeholder="名前orメールで検索"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
)
