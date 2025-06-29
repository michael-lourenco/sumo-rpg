# 🥋 Sumo Legends - RPG de Sumô

**Projeto:** RPG baseado em texto com combate por turnos e árvore de habilidades
**Stack:** Next.js 15 + React 19 + TypeScript + Tailwind CSS
**Arquitetura:** App Router + Componentes modulares + Clean Code + **Sistema de Persistência Agnóstico**

## 📋 Visão Geral do Sistema

### 🎯 Core Gameplay Loop
1. **Criação de Personagem** → Distribuição de pontos em atributos
2. **Atividades Diárias** → Treino (melhora atributos) ou Trabalho (ganha dinheiro)
3. **Árvore de Habilidades** → Compra habilidades com pontos ganhos por nível
4. **Combate por Turnos** → Usa habilidades aprendidas contra oponentes
5. **Progressão** → Sobe de nível e ranking baseado em vitórias
6. **Persistência** → Sistema agnóstico salva progresso automaticamente
7. **Múltiplos Saves** → Até 3 personagens independentes (NOVO)

### 🏗️ Arquitetura Técnica

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home - Menu principal com gerenciador de saves
│   ├── create-character/        # Criação inicial do personagem
│   ├── game/                    # Tela principal do jogo
│   ├── about/                   # Tutorial/Como jogar
│   └── game-completed/          # Tela de vitória final
├── components/                   # Componentes React reutilizáveis
│   ├── ui/                      # Componentes base (Radix UI)
│   ├── daily-activities.tsx     # Atividades diárias (treino/trabalho)
│   ├── character-stats.tsx      # Exibição de estatísticas
│   ├── arena-selection.tsx      # Seleção de arena para combate
│   ├── skill-tree.tsx           # Árvore de habilidades
│   ├── turn-based-combat.tsx    # Combate por turnos
│   ├── combat-history.tsx       # Histórico de combates
│   ├── save-manager.tsx         # Gerenciador de múltiplos saves (NOVO)
│   └── active-save-info.tsx     # Informações do save ativo (NOVO)
└── lib/                         # Lógica de negócio
    ├── types.ts                 # Definições TypeScript
    ├── game-state.ts            # Lógica de jogo (refatorado)
    ├── skills.ts                # Sistema de habilidades
    ├── combat.ts                # Sistema de combate
    ├── utils.ts                 # Utilitários
    └── storage/                 # Sistema de persistência agnóstica
        ├── index.ts             # Configuração e instância principal
        ├── persistence-manager.ts # Gerenciador principal
        ├── local-storage-provider.ts # Provedor localStorage
        ├── indexeddb-provider.ts # Provedor IndexedDB (exemplo)
        ├── README.md            # Documentação do sistema
        └── MULTIPLE_SAVES.md    # Documentação do sistema de saves (NOVO)
```

## 🎮 Sistemas Principais

### 1. Sistema de Personagem (`types.ts`)

```typescript
interface CharacterType {
  name: string
  country: string
  attributes: {
    strength: number      // Força Física - Ataques
    dexterity: number     // Destreza - Precisão
    mentalStrength: number // Força Mental - Resistência
    speed: number         // Velocidade - Agilidade
    defense: number       // Defesa - Proteção
  }
  level: number
  experience: number
  money: number
  wins: number
  losses: number
  rank: string
  skillPoints: number     // Pontos para comprar habilidades
  learnedSkills: string[] // IDs das habilidades aprendidas
}
```

### 2. Sistema de Habilidades (`skills.ts`)

#### Estrutura de Habilidade
```typescript
interface SkillType {
  id: string
  name: string
  description: string
  type: "attack" | "defense" | "utility"
  cost: number                    // Pontos necessários
  requirements: {
    level: number
    attributes: { [key: string]: number }
    prerequisites: string[]       // IDs das habilidades pré-requisitas
  }
  effects: {
    damage?: number              // Dano causado
    healing?: number             // Cura aplicada
    buffs?: { [key: string]: number }    // Buffs próprios
    debuffs?: { [key: string]: number }  // Debuffs no oponente
  }
  cooldown: number               // Turnos de cooldown
  energyCost: number             // Custo de energia
}
```

#### Habilidades Disponíveis
- **Básicas (Nível 1):** `basic-push`, `basic-defense`, `meditation`
- **Intermediárias (Nível 3):** `powerful-thrust`, `agile-dodge`, `intimidate`
- **Avançadas (Nível 5):** `thunder-clap`, `iron-wall`, `battle-focus`
- **Lendárias (Nível 8):** `dragon-rage`, `immortal-stance`

#### Classe SkillManager
```typescript
class SkillManager {
  static canLearnSkill(character: CharacterType, skillId: string): boolean
  static learnSkill(character: CharacterType, skillId: string): CharacterType
  static getAvailableSkills(character: CharacterType): SkillType[]
  static getLearnedSkills(character: CharacterType): SkillType[]
  static isSkillOnCooldown(character: CombatCharacter, skillId: string): boolean
  static applyCooldown(character: CombatCharacter, skillId: string): CombatCharacter
  static reduceCooldowns(character: CombatCharacter): CombatCharacter
}
```

### 3. Sistema de Combate (`combat.ts`)

#### Estados de Combate
```typescript
interface CombatState {
  player: CombatCharacter
  opponent: CombatCharacter
  turn: number
  currentTurn: "player" | "opponent"
  log: CombatLogEntry[]
  gameOver: boolean
  winner: "player" | "opponent" | null
}

interface CombatCharacter {
  name: string
  country: string
  level: number
  attributes: { [key: string]: number }
  maxHealth: number
  currentHealth: number
  maxEnergy: number
  currentEnergy: number
  skills: string[]                    // IDs das habilidades disponíveis
  activeBuffs: Buff[]
  activeDebuffs: Debuff[]
  skillCooldowns: { [skillId: string]: number }
}
```

#### Classe CombatManager
```typescript
class CombatManager {
  static initializeCombatCharacter(...): CombatCharacter
  static initializeCombat(player: CombatCharacter, opponent: CombatCharacter): CombatState
  static executeAction(combatState: CombatState, skillId: string, target: "player" | "opponent"): CombatState
  static getAIAction(combatState: CombatState): string
  static isValidAction(...): boolean
}
```

#### Lógica de Aplicação de Habilidades
- **Ataques** → Afetam o alvo (oponente)
- **Defesas** → Afetam o próprio ator
- **Utilitárias** → Cura/buffs afetam o ator, debuffs afetam o alvo

### 4. Sistema de Persistência Agnóstica (`storage/`) - **NOVO**

#### Arquitetura de Provedores
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

#### Dados Persistidos
- **Personagem** → Progresso, atributos, habilidades
- **Configurações** → Som, música, dificuldade, idioma
- **Histórico de Combate** → Últimos 100 combates com estatísticas
- **Conquistas** → Sistema de achievements com progresso

#### Funcionalidades Avançadas
- **Cache Inteligente** → Reduz chamadas desnecessárias
- **Backup/Restauração** → Exporta/importa todos os dados
- **Migração Automática** → Atualiza dados de versões antigas
- **Logging Detalhado** → Debugging facilitado
- **Estatísticas** → Monitoramento de uso de armazenamento

#### Trocar Provedor de Armazenamento
```typescript
// localStorage (padrão)
const config = { provider: new LocalStorageProvider() }

// IndexedDB
const config = { provider: new IndexedDBProvider() }

// SessionStorage
const config = { provider: new SessionStorageProvider() }

// API REST (exemplo)
const config = { provider: new APIProvider("https://api.example.com") }
```

### 5. Sistema de Múltiplos Saves - **NOVO**

#### Estrutura de Saves
```typescript
interface SaveManager {
  activeSaveId: string | null      // ID do save ativo
  saveSlots: SaveSlot[]           // Lista de slots de save
  maxSlots: number                // Máximo de saves (3)
  lastBackup: string              // Data do último backup
}

interface SaveSlot {
  id: string                      // ID único do save
  character: CharacterType        // Dados do personagem
  lastPlayed: string              // Última vez que jogou
  totalPlayTime: number           // Tempo total de jogo (minutos)
  isActive: boolean               // Se é o save ativo
}
```

#### Funcionalidades Principais
- **Até 3 Saves** → Cada save é completamente independente
- **Migração Automática** → Dados antigos são migrados automaticamente
- **Gerenciamento Visual** → Interface para gerenciar saves
- **Tempo de Jogo** → Registra tempo gasto em cada save
- **Backup/Restauração** → Cada save pode ser exportado/importado

#### Operações de Save
```typescript
// Criar novo save
const saveId = createSave(character)

// Ativar save existente
activateSave(saveId)

// Atualizar save ativo
updateActiveSaveCharacter(updatedCharacter)

// Excluir save
deleteSave(saveId)

// Verificar saves
const hasExistingSaves = hasSaves()
const canCreateNew = canCreateSave()
const saveCount = getSaveCount()
```

#### Componentes de Interface
- **SaveManager** → Gerenciamento completo de saves
- **ActiveSaveInfo** → Informações do save ativo
- **Migração Automática** → Dados antigos são preservados

### 6. Sistema de Estado (`game-state.ts`)

#### Funções de Compatibilidade
- **Funções antigas mantidas** para não quebrar código existente
- **Funções novas** para funcionalidades avançadas
- **Validação e migração** automática de dados

#### Funções Principais
```typescript
// Compatibilidade
getCharacter(): CharacterType | null
updateCharacter(character: CharacterType): void
createCharacter(character: CharacterType): void
resetGame(): void

// Novas funcionalidades
levelUp(character: CharacterType): CharacterType
updateRank(character: CharacterType): CharacterType
validateCharacter(character: any): character is CharacterType
migrateCharacter(oldCharacter: any): CharacterType
```

## 🔄 Fluxo de Dados

### 1. Gerenciamento de Saves (NOVO)
```
page.tsx → SaveManager → storage/index.ts → localStorage
```

### 2. Criação de Personagem
```
create-character/page.tsx → createSave() → storage/index.ts → localStorage
```

### 3. Atividades Diárias
```
daily-activities.tsx → game/page.tsx → updateActiveSaveCharacter() → storage/index.ts → localStorage
```

### 4. Árvore de Habilidades
```
skill-tree.tsx → SkillManager → updateActiveSaveCharacter() → storage/index.ts → localStorage
```

### 5. Combate
```
turn-based-combat.tsx → CombatManager → game/page.tsx → updateActiveSaveCharacter() → storage/index.ts → localStorage
```

### 6. Histórico de Combate
```
combat-history.tsx → storage/index.ts → localStorage
```

## 🎯 Pontos de Modificação Principais

### Para Adicionar Novas Habilidades
1. **`src/lib/skills.ts`** - Adicionar à array `SKILLS`
2. **`src/lib/types.ts`** - Verificar se tipos suportam novos efeitos
3. **`src/components/skill-tree.tsx`** - Verificar se interface suporta

### Para Modificar Combate
1. **`src/lib/combat.ts`** - Lógica principal de combate
2. **`src/components/turn-based-combat.tsx`** - Interface de combate
3. **`src/lib/skills.ts`** - Efeitos das habilidades

### Para Modificar Atividades
1. **`src/components/daily-activities.tsx`** - Lista de atividades
2. **`src/lib/types.ts`** - Interface `ActivityType`
3. **`src/app/game/page.tsx`** - Lógica de processamento

### Para Modificar Progressão
1. **`src/app/game/page.tsx`** - Função `handleCombatEnd()`
2. **`src/lib/game-state.ts`** - Função `levelUp()`

### Para Modificar Persistência (NOVO)
1. **`src/lib/storage/index.ts`** - Configuração do provedor
2. **`src/lib/storage/persistence-manager.ts`** - Lógica de gerenciamento
3. **`src/lib/storage/*-provider.ts`** - Implementação de novos provedores

### Para Modificar Sistema de Saves (NOVO)
1. **`src/lib/storage/persistence-manager.ts`** - Lógica de gerenciamento de saves
2. **`src/components/save-manager.tsx`** - Interface de gerenciamento
3. **`src/components/active-save-info.tsx`** - Informações do save ativo
4. **`src/lib/types.ts`** - Tipos de SaveManager, SaveSlot, SaveMetadata

## 🐛 Debugging e Testes

### Logs Importantes
- **Console do navegador** - Erros de combate e habilidades
- **localStorage** - Verificar dados do personagem
- **React DevTools** - Estado dos componentes
- **Storage logs** - Operações de persistência (se habilitado)

### Pontos de Verificação
1. **Habilidades não aparecem** → Verificar `character.learnedSkills`
2. **Combate não funciona** → Verificar `CombatManager.executeAction()`
3. **Progresso não salva** → Verificar `storage/index.ts`
4. **IA não joga** → Verificar `CombatManager.getAIAction()`
5. **Dados não persistem** → Verificar provedor de armazenamento
6. **Saves não carregam** → Verificar `getActiveSave()` e `activateSave()` (NOVO)
7. **Migração não funciona** → Verificar `migrateOldSave()` (NOVO)

### Ferramentas de Debug
```typescript
// Estatísticas de armazenamento
import { getStorageStats } from "@/lib/storage"
console.log(getStorageStats())

// Backup de dados
import { exportBackup } from "@/lib/storage"
console.log(exportBackup())

// Limpar cache
import { clearCache } from "@/lib/storage"
clearCache()

// Sistema de saves (NOVO)
import { getSaveMetadata, getActiveSave, getSaveCount } from "@/lib/storage"
console.log("Saves:", getSaveMetadata())
console.log("Save ativo:", getActiveSave())
console.log("Total de saves:", getSaveCount())
```

## 🚀 Execução do Projeto

```bash
# Instalação
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm run start
```

## 📝 Convenções de Código

### Nomenclatura
- **Interfaces:** PascalCase (`CharacterType`, `CombatState`)
- **Funções:** camelCase (`getCharacter`, `executeAction`)
- **Constantes:** UPPER_SNAKE_CASE (`SKILLS`, `STORAGE_KEYS`)
- **Componentes:** PascalCase (`SkillTree`, `TurnBasedCombat`)
- **Provedores:** PascalCase + Provider (`LocalStorageProvider`)

### Estrutura de Arquivos
- **Componentes:** Um arquivo por componente
- **Lógica:** Separada em `lib/` por domínio
- **Tipos:** Centralizados em `types.ts`
- **Estado:** Gerenciado via `storage/index.ts`
- **Persistência:** Organizada em `storage/` com provedores separados

### Padrões Utilizados
- **Clean Code:** Funções pequenas e focadas
- **Single Responsibility:** Cada classe/arquivo tem uma responsabilidade
- **TypeScript:** Tipagem forte para prevenir erros
- **React Hooks:** `useState`, `useEffect` para estado local
- **Repository Pattern:** Abstração de persistência
- **Strategy Pattern:** Provedores de armazenamento intercambiáveis

## 🔧 Configurações Importantes

### Dependências Principais
```json
{
  "next": "15.2.2",
  "react": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "@radix-ui/react-*": "^1.x.x"
}
```

### Configurações TypeScript
- **Strict mode** habilitado
- **JSX** configurado para React
- **Paths** configurados para imports `@/`

### Configurações Tailwind
- **Tema âmbar** como cor principal
- **Responsive design** habilitado
- **Custom animations** para transições

### Configurações de Persistência
```typescript
// src/lib/storage/index.ts
const PERSISTENCE_CONFIG: PersistenceConfig = {
  provider: new LocalStorageProvider("sumo-rpg", false),
  keys: STORAGE_KEYS,
  enableLogging: false,
  enableCaching: true,
  cacheExpiration: 5 * 60 * 1000 // 5 minutos
}
```

---

**Última atualização:** Sistema de múltiplos saves implementado com gerenciamento completo
**Próximas melhorias:** Sistema de combos, habilidades únicas por arena, sincronização em tempo real, backup em nuvem 