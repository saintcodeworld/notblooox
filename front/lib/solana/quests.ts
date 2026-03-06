/**
 * Quest System - Earn-to-Play
 * Tracks daily/weekly quests, progress, and SOL reward distribution.
 */

export type QuestType = 'daily' | 'weekly' | 'achievement'
export type QuestStatus = 'locked' | 'active' | 'completed' | 'claimed'

export interface Quest {
  id: string
  title: string
  description: string
  type: QuestType
  rewardSOL: number
  rewardXP: number
  target: number
  progress: number
  status: QuestStatus
  icon: string
  expiresAt?: number
}

export interface PlayerStats {
  walletAddress: string
  playerName: string
  totalEarned: number
  totalXP: number
  level: number
  gamesPlayed: number
  totalPlayTime: number // seconds
  killCount: number
  questsCompleted: number
  dailyStreak: number
  lastActiveDate: string
  joinedAt: string
}

export interface LeaderboardEntry {
  rank: number
  playerName: string
  walletAddress: string
  totalEarned: number
  totalXP: number
  level: number
  gamesPlayed: number
}

// Default quests template
const DAILY_QUESTS: Omit<Quest, 'progress' | 'status'>[] = [
  {
    id: 'daily_play_1',
    title: 'First Steps',
    description: 'Play 1 game today',
    type: 'daily',
    rewardSOL: 0.001,
    rewardXP: 50,
    target: 1,
    icon: '🎮',
  },
  {
    id: 'daily_play_3',
    title: 'Dedicated Gamer',
    description: 'Play 3 games today',
    type: 'daily',
    rewardSOL: 0.003,
    rewardXP: 150,
    target: 3,
    icon: '🔥',
  },
  {
    id: 'daily_time_10',
    title: 'Time Warrior',
    description: 'Play for 10 minutes today',
    type: 'daily',
    rewardSOL: 0.002,
    rewardXP: 100,
    target: 600,
    icon: '⏱️',
  },
  {
    id: 'daily_chat_5',
    title: 'Social Butterfly',
    description: 'Send 5 chat messages',
    type: 'daily',
    rewardSOL: 0.001,
    rewardXP: 30,
    target: 5,
    icon: '💬',
  },
]

const WEEKLY_QUESTS: Omit<Quest, 'progress' | 'status'>[] = [
  {
    id: 'weekly_play_10',
    title: 'Weekly Warrior',
    description: 'Play 10 games this week',
    type: 'weekly',
    rewardSOL: 0.01,
    rewardXP: 500,
    target: 10,
    icon: '⚔️',
  },
  {
    id: 'weekly_time_60',
    title: 'Marathon Runner',
    description: 'Play for 60 minutes this week',
    type: 'weekly',
    rewardSOL: 0.015,
    rewardXP: 750,
    target: 3600,
    icon: '🏃',
  },
  {
    id: 'weekly_streak_5',
    title: 'Streak Master',
    description: 'Maintain a 5-day login streak',
    type: 'weekly',
    rewardSOL: 0.02,
    rewardXP: 1000,
    target: 5,
    icon: '🌟',
  },
]

const ACHIEVEMENT_QUESTS: Omit<Quest, 'progress' | 'status'>[] = [
  {
    id: 'ach_first_sol',
    title: 'First Earnings',
    description: 'Earn your first SOL reward',
    type: 'achievement',
    rewardSOL: 0.005,
    rewardXP: 200,
    target: 1,
    icon: '💰',
  },
  {
    id: 'ach_level_5',
    title: 'Rising Star',
    description: 'Reach level 5',
    type: 'achievement',
    rewardSOL: 0.01,
    rewardXP: 500,
    target: 5,
    icon: '⭐',
  },
  {
    id: 'ach_games_50',
    title: 'Veteran Player',
    description: 'Play 50 games total',
    type: 'achievement',
    rewardSOL: 0.05,
    rewardXP: 2500,
    target: 50,
    icon: '🏆',
  },
]

const STORAGE_KEYS = {
  QUESTS: 'notblox_quests',
  STATS: 'notblox_player_stats',
  LEADERBOARD: 'notblox_leaderboard',
  LAST_DAILY_RESET: 'notblox_last_daily_reset',
  LAST_WEEKLY_RESET: 'notblox_last_weekly_reset',
}

// ─── Function 2: Quest Progress Tracker ───────────────────────────────

export function getQuests(): Quest[] {
  if (typeof window === 'undefined') return []
  checkAndResetQuests()
  const stored = localStorage.getItem(STORAGE_KEYS.QUESTS)
  if (stored) return JSON.parse(stored)
  return initializeQuests()
}

function initializeQuests(): Quest[] {
  const endOfDay = getEndOfDay()
  const endOfWeek = getEndOfWeek()

  const quests: Quest[] = [
    ...DAILY_QUESTS.map((q) => ({
      ...q,
      progress: 0,
      status: 'active' as QuestStatus,
      expiresAt: endOfDay,
    })),
    ...WEEKLY_QUESTS.map((q) => ({
      ...q,
      progress: 0,
      status: 'active' as QuestStatus,
      expiresAt: endOfWeek,
    })),
    ...ACHIEVEMENT_QUESTS.map((q) => ({
      ...q,
      progress: 0,
      status: 'active' as QuestStatus,
    })),
  ]
  localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests))
  return quests
}

function checkAndResetQuests(): void {
  const lastDaily = localStorage.getItem(STORAGE_KEYS.LAST_DAILY_RESET)
  const lastWeekly = localStorage.getItem(STORAGE_KEYS.LAST_WEEKLY_RESET)
  const today = new Date().toDateString()
  const currentWeek = getWeekNumber()

  if (lastDaily !== today) {
    resetQuestsByType('daily')
    localStorage.setItem(STORAGE_KEYS.LAST_DAILY_RESET, today)
  }

  if (lastWeekly !== String(currentWeek)) {
    resetQuestsByType('weekly')
    localStorage.setItem(STORAGE_KEYS.LAST_WEEKLY_RESET, String(currentWeek))
  }
}

function resetQuestsByType(type: QuestType): void {
  const quests = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTS) || '[]') as Quest[]
  const endOfDay = getEndOfDay()
  const endOfWeek = getEndOfWeek()
  const updated = quests.map((q) => {
    if (q.type === type) {
      return {
        ...q,
        progress: 0,
        status: 'active' as QuestStatus,
        expiresAt: type === 'daily' ? endOfDay : endOfWeek,
      }
    }
    return q
  })
  localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(updated))
}

export function updateQuestProgress(questId: string, increment: number = 1): Quest | null {
  const quests = getQuests()
  const quest = quests.find((q) => q.id === questId)
  if (!quest || quest.status !== 'active') return null

  quest.progress = Math.min(quest.progress + increment, quest.target)
  if (quest.progress >= quest.target) {
    quest.status = 'completed'
  }

  localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests))
  return quest
}

export function claimQuestReward(questId: string): { sol: number; xp: number } | null {
  const quests = getQuests()
  const quest = quests.find((q) => q.id === questId)
  if (!quest || quest.status !== 'completed') return null

  quest.status = 'claimed'
  localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests))

  // Update player stats
  const stats = getPlayerStats()
  stats.totalEarned += quest.rewardSOL
  stats.totalXP += quest.rewardXP
  stats.questsCompleted += 1
  stats.level = calculateLevel(stats.totalXP)
  savePlayerStats(stats)

  return { sol: quest.rewardSOL, xp: quest.rewardXP }
}

// Auto-track game events
export function trackGamePlayed(): void {
  const stats = getPlayerStats()
  stats.gamesPlayed += 1
  savePlayerStats(stats)

  // Update relevant quests
  const quests = getQuests()
  quests.forEach((q) => {
    if (
      q.status === 'active' &&
      (q.id.includes('play_') || q.id === 'ach_games_50')
    ) {
      updateQuestProgress(q.id, 1)
    }
  })
}

export function trackPlayTime(seconds: number): void {
  const stats = getPlayerStats()
  stats.totalPlayTime += seconds
  savePlayerStats(stats)

  const quests = getQuests()
  quests.forEach((q) => {
    if (q.status === 'active' && q.id.includes('time_')) {
      updateQuestProgress(q.id, seconds)
    }
  })
}

export function trackChatMessage(): void {
  const quests = getQuests()
  quests.forEach((q) => {
    if (q.status === 'active' && q.id.includes('chat_')) {
      updateQuestProgress(q.id, 1)
    }
  })
}

export function trackDailyLogin(): void {
  const stats = getPlayerStats()
  const today = new Date().toISOString().split('T')[0]

  if (stats.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    stats.dailyStreak = stats.lastActiveDate === yesterday ? stats.dailyStreak + 1 : 1
    stats.lastActiveDate = today
    savePlayerStats(stats)

    // Update streak quests
    const quests = getQuests()
    quests.forEach((q) => {
      if (q.status === 'active' && q.id.includes('streak_')) {
        updateQuestProgress(q.id, 1)
      }
    })
  }
}

// ─── Function 4: Player Stats & Earnings Tracker ──────────────────────

export function getPlayerStats(): PlayerStats {
  if (typeof window === 'undefined') return createDefaultStats()
  const stored = localStorage.getItem(STORAGE_KEYS.STATS)
  if (stored) return JSON.parse(stored)
  const defaults = createDefaultStats()
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(defaults))
  return defaults
}

function createDefaultStats(): PlayerStats {
  return {
    walletAddress: '',
    playerName: (typeof window !== 'undefined' ? localStorage.getItem('playerName') : null) || 'Anonymous',
    totalEarned: 0,
    totalXP: 0,
    level: 1,
    gamesPlayed: 0,
    totalPlayTime: 0,
    killCount: 0,
    questsCompleted: 0,
    dailyStreak: 0,
    lastActiveDate: '',
    joinedAt: new Date().toISOString(),
  }
}

export function savePlayerStats(stats: PlayerStats): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats))
}

export function updateWalletInStats(walletAddress: string): void {
  const stats = getPlayerStats()
  stats.walletAddress = walletAddress
  savePlayerStats(stats)
}

export function calculateLevel(xp: number): number {
  // Level curve: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function xpForNextLevel(currentXP: number): { needed: number; progress: number } {
  const currentLevel = calculateLevel(currentXP)
  const xpForCurrent = (currentLevel - 1) ** 2 * 100
  const xpForNext = currentLevel ** 2 * 100
  const needed = xpForNext - xpForCurrent
  const progress = currentXP - xpForCurrent
  return { needed, progress }
}

// ─── Function 3: Reward Distribution System ───────────────────────────

export interface RewardDrop {
  id: string
  amount: number
  type: 'quest_complete' | 'level_up' | 'daily_bonus' | 'achievement' | 'random_drop'
  message: string
  timestamp: number
}

const pendingRewards: RewardDrop[] = []

export function queueReward(drop: Omit<RewardDrop, 'id' | 'timestamp'>): RewardDrop {
  const reward: RewardDrop = {
    ...drop,
    id: `reward_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  }
  pendingRewards.push(reward)

  // Also add to stats
  const stats = getPlayerStats()
  stats.totalEarned += drop.amount
  savePlayerStats(stats)

  // Track first-earnings achievement
  if (stats.totalEarned > 0) {
    updateQuestProgress('ach_first_sol', 1)
  }

  return reward
}

export function popPendingReward(): RewardDrop | undefined {
  return pendingRewards.shift()
}

export function getPendingRewardCount(): number {
  return pendingRewards.length
}

// ─── Leaderboard (mock - in prod this is server-side) ─────────────────

export function getLeaderboard(): LeaderboardEntry[] {
  // Generate mock leaderboard with the current player included
  const stats = getPlayerStats()
  const mockPlayers: LeaderboardEntry[] = [
    { rank: 1, playerName: 'CryptoKing', walletAddress: '7xKX...9fDm', totalEarned: 2.45, totalXP: 12500, level: 12, gamesPlayed: 156 },
    { rank: 2, playerName: 'SolanaWarrior', walletAddress: '3mNp...kL2w', totalEarned: 1.87, totalXP: 9800, level: 10, gamesPlayed: 132 },
    { rank: 3, playerName: 'BlockMaster', walletAddress: '9pQr...nH5x', totalEarned: 1.52, totalXP: 8200, level: 9, gamesPlayed: 98 },
    { rank: 4, playerName: 'DeFiNinja', walletAddress: '5vBc...jR7t', totalEarned: 1.21, totalXP: 7100, level: 8, gamesPlayed: 87 },
    { rank: 5, playerName: 'GameFiPro', walletAddress: '2wXy...mD4s', totalEarned: 0.98, totalXP: 5500, level: 7, gamesPlayed: 72 },
    { rank: 6, playerName: 'PhantomGamer', walletAddress: '8kLm...pF6a', totalEarned: 0.76, totalXP: 4200, level: 6, gamesPlayed: 65 },
    { rank: 7, playerName: 'Web3Player', walletAddress: '4nRs...bW1q', totalEarned: 0.54, totalXP: 3100, level: 5, gamesPlayed: 48 },
    { rank: 8, playerName: 'SOLHunter', walletAddress: '6tYu...cE8z', totalEarned: 0.42, totalXP: 2400, level: 4, gamesPlayed: 35 },
  ]

  // Insert current player
  const playerEntry: LeaderboardEntry = {
    rank: 0,
    playerName: stats.playerName + ' (You)',
    walletAddress: stats.walletAddress ? stats.walletAddress.slice(0, 4) + '...' + stats.walletAddress.slice(-4) : 'Not connected',
    totalEarned: stats.totalEarned,
    totalXP: stats.totalXP,
    level: stats.level,
    gamesPlayed: stats.gamesPlayed,
  }

  const allPlayers = [...mockPlayers, playerEntry].sort((a, b) => b.totalEarned - a.totalEarned)
  return allPlayers.map((p, i) => ({ ...p, rank: i + 1 }))
}

// ─── Function 5: Anti-Cheat Validation ────────────────────────────────

interface ValidationToken {
  hash: string
  timestamp: number
  action: string
  nonce: string
}

const recentActions: { action: string; timestamp: number }[] = []
const MAX_ACTIONS_PER_MINUTE = 30
const MIN_ACTION_INTERVAL_MS = 500

export function validateRewardClaim(questId: string, walletAddress: string): { valid: boolean; reason?: string } {
  const now = Date.now()

  // Rate limiting: no more than MAX_ACTIONS_PER_MINUTE per minute
  const oneMinuteAgo = now - 60000
  const recentCount = recentActions.filter((a) => a.timestamp > oneMinuteAgo).length
  if (recentCount >= MAX_ACTIONS_PER_MINUTE) {
    return { valid: false, reason: 'Rate limit exceeded. Please wait before claiming.' }
  }

  // Cooldown: no rapid-fire claims
  const lastAction = recentActions[recentActions.length - 1]
  if (lastAction && now - lastAction.timestamp < MIN_ACTION_INTERVAL_MS) {
    return { valid: false, reason: 'Too fast. Please wait a moment.' }
  }

  // Validate quest completion
  const quests = getQuests()
  const quest = quests.find((q) => q.id === questId)
  if (!quest) return { valid: false, reason: 'Quest not found.' }
  if (quest.status !== 'completed') return { valid: false, reason: 'Quest not yet completed.' }
  if (quest.progress < quest.target) return { valid: false, reason: 'Quest progress tampered.' }

  // Validate wallet
  if (!walletAddress || walletAddress.length < 32) {
    return { valid: false, reason: 'Invalid wallet address.' }
  }

  // Check for expired quests
  if (quest.expiresAt && quest.expiresAt < now) {
    return { valid: false, reason: 'Quest has expired.' }
  }

  // Record this action
  recentActions.push({ action: `claim_${questId}`, timestamp: now })

  // Cleanup old actions
  while (recentActions.length > 100) recentActions.shift()

  return { valid: true }
}

export function generateActionToken(action: string): ValidationToken {
  const nonce = Math.random().toString(36).slice(2, 10)
  const timestamp = Date.now()
  const raw = `${action}:${timestamp}:${nonce}`
  // Simple hash for client-side validation (server would use HMAC)
  let hash = 0
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return { hash: Math.abs(hash).toString(16), timestamp, action, nonce }
}

export function verifyActionToken(token: ValidationToken): boolean {
  const now = Date.now()
  // Token must be less than 5 minutes old
  if (now - token.timestamp > 300000) return false
  // Verify token structure is valid
  return token.hash.length > 0 && token.timestamp > 0 && token.action.length > 0
}

// ─── Helpers ──────────────────────────────────────────────────────────

function getEndOfDay(): number {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

function getEndOfWeek(): number {
  const d = new Date()
  const day = d.getDay()
  const diff = 7 - day
  d.setDate(d.getDate() + diff)
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

function getWeekNumber(): number {
  const d = new Date()
  const start = new Date(d.getFullYear(), 0, 1)
  const diff = d.getTime() - start.getTime()
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000))
}
