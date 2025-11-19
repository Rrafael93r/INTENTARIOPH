"use client"

import type React from "react"
import { getCurrentUser } from "../../servicios/authServices"
import Layout from "./Layout"
import SimpleLayout from "./SimpleLayout"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const user = getCurrentUser()

  // Si no hay usuario, mostrar layout normal (será redirigido al login)
  if (!user) {
    return <Layout>{children}</Layout>
  }

  // Si es usuario reportador (rol 3), usar layout simple
  if (user.roleId === 3) {
    return <SimpleLayout>{children}</SimpleLayout>
  }

  // Para otros roles, usar layout con sidebar
  return <Layout>{children}</Layout>
}

export default ConditionalLayout
