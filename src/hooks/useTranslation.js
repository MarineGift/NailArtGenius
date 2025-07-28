'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export function useTranslation() {
  const params = useParams()
  const [dict, setDict] = useState(null)
  const [loading, setLoading] = useState(true)
  const lang = params?.lang || 'ko'

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true)
        const dictionary = await import(`../../public/locales/${lang}/common.json`)
        setDict(dictionary.default)
      } catch (error) {
        console.error('Failed to load dictionary:', error)
        // Fallback to Korean
        const fallback = await import(`../../public/locales/ko/common.json`)
        setDict(fallback.default)
      } finally {
        setLoading(false)
      }
    }

    loadDictionary()
  }, [lang])

  const t = (key, fallback = '') => {
    if (!dict || loading) return fallback
    
    const keys = key.split('.')
    let value = dict
    
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }
    
    return value || fallback
  }

  return { t, dict, loading, lang }
}