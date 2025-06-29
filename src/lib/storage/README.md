# Sistema de Persistência de Dados - Sumo Legends

## 📋 Visão Geral

O sistema de persistência foi projetado para ser **agnóstico** ao provedor de armazenamento, permitindo trocar facilmente entre diferentes bases de dados sem modificar o código da aplicação.

## 🏗️ Arquitetura

### Interfaces Principais

```typescript
// Provedor síncrono (localStorage, sessionStorage)
interface StorageProvider {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
  has(key: string): boolean
}

// Provedor assíncrono (IndexedDB, APIs REST)
interface AsyncStorageProvider {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
  has(key: string): Promise<boolean>
}
```

### Estrutura de Arquivos

```
src/lib/storage/
├── index.ts                    # Configuração e instância principal
├── persistence-manager.ts      # Gerenciador principal
├── local-storage-provider.ts   # Provedor localStorage
├── indexeddb-provider.ts       # Provedor IndexedDB (exemplo)
└── README.md                   # Esta documentação
```

## 🚀 Como Usar

### 1. Uso Básico (Recomendado)

```typescript
import { 
  getCharacter, 
  saveCharacter, 
  addCombatHistory,
  getCombatHistory 
} from "@/lib/storage"

// Obtém personagem
const character = getCharacter()

// Salva personagem
saveCharacter(updatedCharacter)

// Adiciona histórico de combate
addCombatHistory({
  id: Date.now().toString(),
  date: new Date().toISOString(),
  playerName: "João",
  opponentName: "Hakuho",
  result: "win",
  arena: "Arena Principal",
  turns: 5,
  playerLevel: 10,
  opponentLevel: 12
})

// Obtém histórico
const history = getCombatHistory()
```

### 2. Uso Avançado (Acesso Direto ao Manager)

```typescript
import { persistenceManager } from "@/lib/storage"

// Gerenciamento de personagem
const character = persistenceManager.getCharacter()
persistenceManager.saveCharacter(character)
persistenceManager.deleteCharacter()

// Configurações do jogo
const settings = persistenceManager.getGameSettings()
persistenceManager.updateGameSettings({ soundEnabled: false })

// Histórico de combate
const history = persistenceManager.getCombatHistory()
persistenceManager.addCombatHistory(entry)

// Conquistas
const achievements = persistenceManager.getAchievements()
persistenceManager.unlockAchievement("first-win")

// Backup e restauração
const backup = persistenceManager.exportBackup()
persistenceManager.importBackup(backupJson)
```

## 🔄 Trocar Provedor de Armazenamento

### 1. Para IndexedDB

```typescript
// src/lib/storage/index.ts
import { IndexedDBProvider } from "./indexeddb-provider"

const PERSISTENCE_CONFIG: PersistenceConfig = {
  provider: new IndexedDBProvider("sumo-rpg-db", "game-data", 1),
  keys: STORAGE_KEYS,
  enableLogging: true,
  enableCaching: true,
  cacheExpiration: 5 * 60 * 1000
}
```

### 2. Para SessionStorage

```typescript
// src/lib/storage/index.ts
import { SessionStorageProvider } from "./indexeddb-provider"

const PERSISTENCE_CONFIG: PersistenceConfig = {
  provider: new SessionStorageProvider("sumo-rpg"),
  keys: STORAGE_KEYS,
  enableLogging: false,
  enableCaching: false
}
```

### 3. Para API REST (Exemplo)

```typescript
// src/lib/storage/api-provider.ts
export class APIProvider implements AsyncStorageProvider {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async get<T>(key: string): Promise<T | null> {
    const response = await fetch(`${this.baseUrl}/data/${key}`)
    return response.ok ? response.json() : null
  }

  async set<T>(key: string, value: T): Promise<void> {
    await fetch(`${this.baseUrl}/data/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    })
  }

  // ... outros métodos
}
```

## 📊 Dados Persistidos

### 1. Personagem (`character`)
```typescript
interface CharacterType {
  name: string
  country: string
  attributes: { strength, dexterity, mentalStrength, speed, defense }
  level: number
  experience: number
  money: number
  wins: number
  losses: number
  rank: string
  skillPoints: number
  learnedSkills: string[]
}
```

### 2. Configurações (`game-settings`)
```typescript
interface GameSettings {
  soundEnabled: boolean
  musicEnabled: boolean
  difficulty: "easy" | "normal" | "hard"
  language: string
  lastSaveDate: string
}
```

### 3. Histórico de Combate (`combat-history`)
```typescript
interface CombatHistoryEntry {
  id: string
  date: string
  playerName: string
  opponentName: string
  result: "win" | "lose"
  arena: string
  turns: number
  playerLevel: number
  opponentLevel: number
}
```

### 4. Conquistas (`achievements`)
```typescript
interface Achievement {
  id: string
  name: string
  description: string
  unlocked: boolean
  unlockedDate?: string
  progress?: number
  maxProgress?: number
}
```

## 🔧 Funcionalidades Avançadas

### Cache Inteligente
- Cache automático com expiração configurável
- Reduz chamadas desnecessárias ao provedor
- Melhora performance em operações repetitivas

### Backup e Restauração
```typescript
// Exporta todos os dados
const backup = exportBackup()

// Restaura dados
const success = importBackup(backupJson)
```

### Estatísticas de Armazenamento
```typescript
const stats = getStorageStats()
console.log(`Total de chaves: ${stats.totalKeys}`)
console.log(`Tamanho total: ${stats.totalSize} bytes`)
console.log(`Tamanho do cache: ${stats.cacheSize}`)
console.log(`Taxa de hit do cache: ${stats.cacheHitRate}%`)
```

### Logging
- Logs detalhados em desenvolvimento
- Rastreamento de operações de armazenamento
- Debugging facilitado

## 🛡️ Tratamento de Erros

### Validação de Dados
```typescript
import { validateCharacter, migrateCharacter } from "@/lib/game-state"

// Valida personagem antes de salvar
if (validateCharacter(character)) {
  saveCharacter(character)
} else {
  // Migra dados de versões antigas
  const migrated = migrateCharacter(character)
  saveCharacter(migrated)
}
```

### Fallback para localStorage
```typescript
try {
  // Tenta usar IndexedDB
  const data = await indexedDBProvider.get(key)
} catch (error) {
  // Fallback para localStorage
  const data = localStorageProvider.get(key)
}
```

## 🚀 Migração de Versões

### Migração Automática
O sistema detecta automaticamente dados de versões antigas e os migra:

```typescript
// Dados antigos (sem skillPoints)
const oldCharacter = {
  name: "João",
  level: 5,
  // ... outros campos
}

// Migração automática
const migrated = migrateCharacter(oldCharacter)
// Resultado: skillPoints: 3, learnedSkills: []
```

## 📝 Boas Práticas

### 1. Sempre Use as Funções de Conveniência
```typescript
// ✅ Correto
import { getCharacter, saveCharacter } from "@/lib/storage"

// ❌ Evite acesso direto
import { persistenceManager } from "@/lib/storage"
```

### 2. Trate Erros de Persistência
```typescript
try {
  saveCharacter(character)
} catch (error) {
  console.error("Erro ao salvar personagem:", error)
  // Implementar fallback ou notificar usuário
}
```

### 3. Use Cache Quando Apropriado
```typescript
// Para dados que mudam pouco
const settings = getGameSettings()

// Para dados que mudam frequentemente
const character = getCharacter() // Sempre busca do storage
```

### 4. Backup Regular
```typescript
// Implementar backup automático
setInterval(() => {
  const backup = exportBackup()
  // Salvar backup em local secundário
}, 5 * 60 * 1000) // A cada 5 minutos
```

## 🔮 Próximos Passos

1. **Implementar provedor para APIs REST**
2. **Adicionar sincronização em tempo real**
3. **Implementar compressão de dados**
4. **Adicionar criptografia para dados sensíveis**
5. **Criar interface de administração de dados**

---

**Última atualização:** Sistema de persistência agnóstica implementado
**Versão:** 1.0.0 