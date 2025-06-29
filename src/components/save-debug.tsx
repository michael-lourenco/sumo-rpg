"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  getSaveManager, 
  getActiveSave, 
  hasSaves, 
  getSaveCount,
  createSave,
  activateSave,
  clearCache,
  getCharacter
} from "@/lib/storage"

export function SaveDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  const loadDebugInfo = () => {
    setIsLoading(true)
    try {
      console.log("SaveDebug - Iniciando carregamento de debug info")
      
      const saveManager = getSaveManager()
      const activeSave = getActiveSave()
      const hasSavesResult = hasSaves()
      const saveCount = getSaveCount()
      
      const info = {
        saveManager,
        activeSave,
        hasSaves: hasSavesResult,
        saveCount,
        timestamp: new Date().toISOString()
      }
      
      console.log("SaveDebug - Debug info carregada:", info)
      setDebugInfo(info)
    } catch (error) {
      console.error("SaveDebug - Erro ao carregar debug info:", error)
      setDebugInfo({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const testCreateSave = async () => {
    setIsLoading(true)
    try {
      console.log("SaveDebug - Testando criação de save")
      
      const testCharacter = {
        name: "Teste Debug",
        country: "Brasil",
        attributes: {
          strength: 10,
          dexterity: 10,
          mentalStrength: 10,
          speed: 10,
          defense: 10
        },
        level: 1,
        experience: 0,
        money: 100,
        skills: [],
        passives: [],
        wins: 0,
        losses: 0,
        rank: "Iniciante",
        skillPoints: 0,
        learnedSkills: []
      }
      
      const saveId = await createSave(testCharacter)
      console.log("SaveDebug - Save criado com ID:", saveId)
      
      await activateSave(saveId)
      console.log("SaveDebug - Save ativado")
      
      // Recarrega debug info
      setTimeout(loadDebugInfo, 100)
    } catch (error) {
      console.error("SaveDebug - Erro ao criar save:", error)
      setDebugInfo({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const clearCacheAndReload = () => {
    setIsLoading(true)
    try {
      console.log("SaveDebug - Limpando cache")
      clearCache()
      setTimeout(loadDebugInfo, 100)
    } catch (error) {
      console.error("SaveDebug - Erro ao limpar cache:", error)
      setDebugInfo({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const testGetCharacter = () => {
    setIsLoading(true)
    try {
      console.log("SaveDebug - Testando getCharacter()")
      
      const character = getCharacter()
      console.log("SaveDebug - getCharacter() retornou:", character)
      
      const activeSave = getActiveSave()
      console.log("SaveDebug - getActiveSave() retornou:", activeSave)
      
      const info = {
        character,
        activeSave,
        hasCharacter: character !== null,
        timestamp: new Date().toISOString()
      }
      
      setDebugInfo(info)
    } catch (error) {
      console.error("SaveDebug - Erro ao testar getCharacter:", error)
      setDebugInfo({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDebugInfo()
  }, [])

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-lg">Debug - Sistema de Saves</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={loadDebugInfo} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Recarregar Info
          </Button>
          <Button 
            onClick={testCreateSave} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Testar Criação
          </Button>
          <Button 
            onClick={clearCacheAndReload} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Limpar Cache
          </Button>
          <Button 
            onClick={testGetCharacter} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Testar getCharacter()
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-800 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Carregando...</p>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
} 