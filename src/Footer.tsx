//  src/Footer.tsx
//  フッター（今はテーマボタン）
import { useTheme } from "./ThemeContext"

export default function Footer() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <div>操作</div>
      <button
        onClick={(e) => {
          toggleTheme()
          e.currentTarget.blur()
        }}
      >
        テーマ変更『{theme}』
      </button>
    </>
  )
}