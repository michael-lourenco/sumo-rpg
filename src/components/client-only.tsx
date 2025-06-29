"use client"

import React, { useEffect, useState } from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Componente que só renderiza seus filhos no cliente
 * Evita erros de hidratação no Next.js
 */
export function ClientOnly({ children, fallback }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
} 