// src/hooks/useQueryParams.ts
import { useSearchParams } from "react-router-dom"

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const updateParams = (params: Record<string, string>) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      Object.entries(params).forEach(([key, value]) => {
        value === "" ? newParams.delete(key) : newParams.set(key, value)
      })
      return newParams
    })
  }

  return { searchParams, updateParams }
}
