# Sistema de Múltiplos Saves - Sumo Legends

## 📋 Visão Geral

O sistema de múltiplos saves permite que os jogadores tenham até **3 personagens diferentes**, cada um com seu próprio progresso, histórico de combate e configurações. Cada save é completamente independente e pode ser gerenciado separadamente.

## 🏗️ Arquitetura

### Estrutura de Dados

```typescript
// Gerenciador de saves
interface SaveManager {
  activeSaveId: string | null      // ID do save ativo
  saveSlots: SaveSlot[]           // Lista de slots de save
  maxSlots: number                // Máximo de saves (3)
  lastBackup: string              // Data do último backup
}

// Slot de save individual
interface SaveSlot {
  id: string                      // ID único do save
  character: CharacterType        // Dados do personagem
  lastPlayed: string              // Última vez que jogou
  totalPlayTime: number           // Tempo total de jogo (minutos)
  isActive: boolean               // Se é o save ativo
}

// Metadados para exibição
interface SaveMetadata {
  id: string
  characterName: string
  characterLevel: number
  characterRank: string
  lastPlayed: string
  totalPlayTime: number
  isActive: boolean
}
```

### Armazenamento

```
localStorage:
├── save-manager                  # Gerenciador principal
├── save-slot:save_123456789     # Slot de save 1
├── save-slot:save_987654321     # Slot de save 2
├── save-slot:save_456789123     # Slot de save 3
├── game-settings                 # Configurações globais
├── combat-history                # Histórico global
└── achievements                  # Conquistas globais
```

## 🚀 Como Usar

### 1. Verificar Saves Existentes

```typescript
import { hasSaves, getSaveMetadata } from "@/lib/storage"

// Verifica se há saves
const hasExistingSaves = hasSaves()

// Obtém metadados de todos os saves
const saves = getSaveMetadata()
```

### 2. Criar Novo Save

```typescript
import { createSave, canCreateSave } from "@/lib/storage"

// Verifica se pode criar novo save
if (canCreateSave()) {
  const character: CharacterType = {
    name: "João",
    country: "Brasil",
    // ... outros dados
  }
  
  // Cria novo save
  const saveId = createSave(character)
  console.log("Save criado:", saveId)
} else {
  alert("Número máximo de saves atingido")
}
```

### 3. Carregar Save

```typescript
import { activateSave, getActiveSave } from "@/lib/storage"

// Ativa um save específico
activateSave("save_123456789")

// Obtém o save ativo
const activeSave = getActiveSave()
if (activeSave) {
  console.log("Personagem ativo:", activeSave.character.name)
}
```

### 4. Atualizar Save Ativo

```typescript
import { updateActiveSaveCharacter } from "@/lib/storage"

// Atualiza o personagem do save ativo
const updatedCharacter = { ...character, level: 10 }
updateActiveSaveCharacter(updatedCharacter)
```

### 5. Excluir Save

```typescript
import { deleteSave } from "@/lib/storage"

// Remove um save específico
deleteSave("save_123456789")
```

## 🎮 Fluxo de Jogo

### 1. Primeira Execução
```
1. Jogador acessa o jogo
2. Sistema verifica se há saves existentes
3. Se não há saves → Mostra opção "Novo Jogo"
4. Se há saves → Mostra opções "Continuar Jogo" e "Gerenciar Saves"
```

### 2. Criação de Personagem
```
1. Jogador clica em "Novo Jogo"
2. Sistema verifica se há slots disponíveis
3. Jogador cria personagem
4. Sistema cria novo save automaticamente
5. Redireciona para o jogo
```

### 3. Carregamento de Save
```
1. Jogador seleciona save existente
2. Sistema ativa o save selecionado
3. Desativa outros saves
4. Carrega dados do personagem
5. Redireciona para o jogo
```

### 4. Durante o Jogo
```
1. Todas as ações atualizam o save ativo
2. Sistema registra tempo de jogo
3. Histórico de combate é salvo
4. Progresso é persistido automaticamente
```

## 🔧 Funcionalidades

### Migração Automática
```typescript
import { migrateOldSave } from "@/lib/storage"

// Migra dados antigos para novo sistema
migrateOldSave()
```

### Estatísticas
```typescript
import { getSaveCount, getMaxSaves } from "@/lib/storage"

const currentSaves = getSaveCount()    // 2
const maxSaves = getMaxSaves()         // 3
const canCreate = currentSaves < maxSaves
```

### Tempo de Jogo
```typescript
import { updatePlayTime } from "@/lib/storage"

// Adiciona 5 minutos de jogo
updatePlayTime("save_123456789", 5)
```

## 🎯 Componentes React

### SaveManager
```tsx
<SaveManager 
  onSaveSelected={() => console.log("Save selecionado")}
  onNewGame={() => console.log("Novo jogo")}
/>
```

### ActiveSaveInfo
```tsx
<ActiveSaveInfo 
  onBackToMenu={() => router.push("/")}
/>
```

## 📊 Dados Persistidos por Save

### Personagem
- Nome, país, atributos
- Nível, experiência, dinheiro
- Vitórias, derrotas, ranking
- Pontos de habilidade, habilidades aprendidas

### Histórico de Combate
- Últimos 100 combates
- Estatísticas detalhadas
- Informações do oponente

### Configurações
- Configurações de som/música
- Dificuldade, idioma
- Preferências do jogador

## 🛡️ Tratamento de Erros

### Validação de Saves
```typescript
// Verifica se save existe antes de usar
const save = getActiveSave()
if (!save) {
  // Redireciona para criação de personagem
  router.push("/create-character")
  return
}
```

### Limite de Saves
```typescript
// Verifica se pode criar novo save
if (!canCreateSave()) {
  alert("Número máximo de saves atingido")
  return
}
```

### Migração de Dados
```typescript
// Migra automaticamente dados antigos
useEffect(() => {
  migrateOldSave()
}, [])
```

## 🔄 Compatibilidade

### Funções Legadas
```typescript
// Funções antigas continuam funcionando
getCharacter()     // Retorna personagem do save ativo
saveCharacter()    // Salva no save ativo
hasCharacter()     // Verifica se há save ativo
```

### Migração Automática
- Dados antigos são migrados automaticamente
- Um save é criado com o personagem existente
- Dados antigos são removidos após migração

## 📝 Boas Práticas

### 1. Sempre Verifique o Save Ativo
```typescript
const activeSave = getActiveSave()
if (!activeSave) {
  // Trate caso sem save ativo
}
```

### 2. Use Funções de Conveniência
```typescript
// ✅ Correto
import { getCharacter, saveCharacter } from "@/lib/storage"

// ❌ Evite acesso direto
import { persistenceManager } from "@/lib/storage"
```

### 3. Trate Limites de Save
```typescript
if (!canCreateSave()) {
  // Mostre mensagem apropriada
  alert("Exclua um save para criar um novo")
}
```

### 4. Atualize Tempo de Jogo
```typescript
// Atualize periodicamente
setInterval(() => {
  const activeSave = getActiveSave()
  if (activeSave) {
    updatePlayTime(activeSave.id, 1) // +1 minuto
  }
}, 60000) // A cada minuto
```

## 🔮 Próximas Melhorias

1. **Sincronização em Nuvem** - Salvar saves na nuvem
2. **Backup Automático** - Backup periódico de saves
3. **Compartilhamento** - Compartilhar saves entre dispositivos
4. **Estatísticas Avançadas** - Mais métricas de jogo
5. **Templates** - Personagens pré-configurados

---

**Última atualização:** Sistema de múltiplos saves implementado
**Versão:** 1.0.0 