# 🥋 Sumo Legends - RPG de Sumô

**Projeto:** RPG baseado em texto com combate por turnos e árvore de habilidades
**Stack:** Next.js 15 + React 19 + TypeScript + Tailwind CSS
**Arquitetura:** App Router + Componentes modulares + Clean Code

## 📋 Visão Geral do Sistema

### 🎯 Core Gameplay Loop
1. **Criação de Personagem** → Distribuição de pontos em atributos
2. **Atividades Diárias** → Treino (melhora atributos) ou Trabalho (ganha dinheiro)
3. **Árvore de Habilidades** → Compra habilidades com pontos ganhos por nível
4. **Combate por Turnos** → Usa habilidades aprendidas contra oponentes
5. **Progressão** → Sobe de nível e ranking baseado em vitórias

### 🏗️ Arquitetura Técnica

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home - Menu principal
│   ├── create-character/        # Criação inicial do personagem
│   ├── game/                    # Tela principal do jogo
│   ├── about/                   # Tutorial/Como jogar
│   └── game-completed/          # Tela de vitória final
├── components/                   # Componentes React reutilizáveis
│   ├── ui/                      # Componentes base (Radix UI)
│   ├── daily-activities.tsx     # Atividades diárias (treino/trabalho)
│   ├── character-stats.tsx      # Exibição de estatísticas
│   ├── arena-selection.tsx      # Seleção de arena para combate
│   ├── skill-tree.tsx           # Árvore de habilidades (NOVO)
│   └── turn-based-combat.tsx    # Combate por turnos (NOVO)
└── lib/                         # Lógica de negócio
    ├── types.ts                 # Definições TypeScript
    ├── game-state.ts            # Persistência (localStorage)
    ├── skills.ts                # Sistema de habilidades (NOVO)
    ├── combat.ts                # Sistema de combate (NOVO)
    └── utils.ts                 # Utilitários
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

### 4. Sistema de Estado (`game-state.ts`)

#### Persistência
- **localStorage** para salvar progresso
- **Chave:** `"sumo-rpg-character"`
- **Funções principais:**
  - `getCharacter()`: Carrega personagem
  - `updateCharacter()`: Salva personagem
  - `createCharacter()`: Cria novo personagem
  - `addSkillPoints()`: Adiciona pontos de habilidade
  - `learnSkill()`: Aprende nova habilidade

## 🔄 Fluxo de Dados

### 1. Criação de Personagem
```
create-character/page.tsx → game-state.ts → localStorage
```

### 2. Atividades Diárias
```
daily-activities.tsx → game/page.tsx → game-state.ts → localStorage
```

### 3. Árvore de Habilidades
```
skill-tree.tsx → SkillManager → game-state.ts → localStorage
```

### 4. Combate
```
turn-based-combat.tsx → CombatManager → game/page.tsx → game-state.ts
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
2. **`src/lib/game-state.ts`** - Função `addSkillPoints()`

## 🐛 Debugging e Testes

### Logs Importantes
- **Console do navegador** - Erros de combate e habilidades
- **localStorage** - Verificar dados do personagem
- **React DevTools** - Estado dos componentes

### Pontos de Verificação
1. **Habilidades não aparecem** → Verificar `character.learnedSkills`
2. **Combate não funciona** → Verificar `CombatManager.executeAction()`
3. **Progresso não salva** → Verificar `game-state.ts`
4. **IA não joga** → Verificar `CombatManager.getAIAction()`

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
- **Constantes:** UPPER_SNAKE_CASE (`SKILLS`, `CHARACTER_KEY`)
- **Componentes:** PascalCase (`SkillTree`, `TurnBasedCombat`)

### Estrutura de Arquivos
- **Componentes:** Um arquivo por componente
- **Lógica:** Separada em `lib/` por domínio
- **Tipos:** Centralizados em `types.ts`
- **Estado:** Gerenciado via `game-state.ts`

### Padrões Utilizados
- **Clean Code:** Funções pequenas e focadas
- **Single Responsibility:** Cada classe/arquivo tem uma responsabilidade
- **TypeScript:** Tipagem forte para prevenir erros
- **React Hooks:** `useState`, `useEffect` para estado local

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

---

**Última atualização:** Sistema de combate por turnos e árvore de habilidades implementado
**Próximas melhorias:** Sistema de combos, habilidades únicas por arena 