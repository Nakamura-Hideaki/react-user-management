// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./ThemeContext"
import { AppProvider } from "./AppContext"
import Header from "./Header"
import { UserList as UserListPage } from "./pages/UserList"
import { UserDetail } from "./UserDetail"
import Footer from "./Footer"
import { Layout } from "./components/Layout"

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Layout>
            <Header />
              <Routes>
                <Route path="/" element={<UserListPage />} />
                <Route path="/users/:id" element={<UserDetail />} />
              </Routes>
            <Footer />
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App