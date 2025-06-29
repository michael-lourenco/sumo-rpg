"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCombatHistory, clearCombatHistory } from "@/lib/storage"
import type { CombatHistoryEntry } from "@/lib/types"
import { Trophy, X, Calendar, MapPin, Users } from "lucide-react"

export function CombatHistory() {
  const [history, setHistory] = useState<CombatHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    setIsLoading(true)
    const combatHistory = getCombatHistory()
    setHistory(combatHistory)
    setIsLoading(false)
  }

  const handleClearHistory = () => {
    if (confirm("Tem certeza que deseja limpar todo o histórico de combate?")) {
      clearCombatHistory()
      setHistory([])
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getResultIcon = (result: "win" | "lose") => {
    return result === "win" ? (
      <Trophy className="text-yellow-500" size={16} />
    ) : (
      <X className="text-red-500" size={16} />
    )
  }

  const getResultColor = (result: "win" | "lose") => {
    return result === "win" 
      ? "bg-green-50 border-green-200 text-green-800" 
      : "bg-red-50 border-red-200 text-red-800"
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Combate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando...</div>
        </CardContent>
      </Card>
    )
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Combate</CardTitle>
          <CardDescription>Nenhum combate registrado ainda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Complete seu primeiro combate para ver o histórico aqui
          </div>
        </CardContent>
      </Card>
    )
  }

  const stats = {
    total: history.length,
    wins: history.filter(h => h.result === "win").length,
    losses: history.filter(h => h.result === "lose").length,
    winRate: history.length > 0 
      ? Math.round((history.filter(h => h.result === "win").length / history.length) * 100)
      : 0
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Estatísticas de Combate
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearHistory}
              className="text-red-600 hover:text-red-700"
            >
              Limpar Histórico
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.wins}</div>
              <div className="text-sm text-gray-600">Vitórias</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.losses}</div>
              <div className="text-sm text-gray-600">Derrotas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.winRate}%</div>
              <div className="text-sm text-gray-600">Taxa de Vitória</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Combates */}
      <Card>
        <CardHeader>
          <CardTitle>Combates Recentes</CardTitle>
          <CardDescription>Últimos {history.length} combates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history.slice(-10).reverse().map((entry) => (
              <div 
                key={entry.id} 
                className={`p-4 rounded-lg border ${getResultColor(entry.result)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getResultIcon(entry.result)}
                    <div>
                      <div className="font-medium">
                        {entry.playerName} vs {entry.opponentName}
                      </div>
                      <div className="text-sm opacity-80">
                        {entry.result === "win" ? "Vitória" : "Derrota"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin size={14} />
                      {entry.arena}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <Users size={14} />
                      Nv.{entry.playerLevel} vs Nv.{entry.opponentLevel}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(entry.date)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs opacity-70">
                  Combate durou {entry.turns} turno{entry.turns > 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 