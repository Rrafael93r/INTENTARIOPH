import type React from "react"
import Sidebar from "../Sidebar/Sidebar"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className="container-fluid vh-100">
        <div className="row h-100">
          <Sidebar />
          <main className=" ms-sm-auto col-lg-10 p-4 overflow-auto" style={{ maxHeight: "100vh" }}>
            {children}
          </main>
        </div>
      </div>
    </>
  )
}

export default Layout
