//  src/components/Layout.tsx

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="page">
      {children}
    </div>
  )
}
