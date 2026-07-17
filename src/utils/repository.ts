import { UserStats, Achievement } from "../types";

export interface UserProfile {
  name: string;
  classLevel: string;
  school: string;
  province?: string;
  avatar: string;
  activeTitle: string;
}

export interface DailyTask {
  id: string;
  title: string;
  requirement: number;
  progress: number;
  xpReward: number;
  coinsReward: number;
  completed: boolean;
  type: "practice" | "chat" | "game" | "exam";
}

export interface HistoryEntry {
  id: string;
  type: "practice" | "game" | "exam";
  title: string;
  score: number;
  total?: number;
  xpGained: number;
  coinsGained: number;
  date: string; // ISO date string
}

const initialAchievements: Achievement[] = [
  { id: "first-step", title: "Khởi đầu mới", description: "Hoàn thành bài học lý thuyết đầu tiên", icon: "🌱", unlocked: false },
  { id: "shield-polynomial", title: "Chiến thần Đa thức", description: "Đạt điểm 10/10 tuyệt đối trong bài kiểm tra", icon: "🛡️", unlocked: false },
  { id: "game-high", title: "Chuyên gia bắn bóng", description: "Ghi từ 50 điểm trong game Đấu trường", icon: "🎈", unlocked: false },
  { id: "shop-collector", title: "Dân chơi Đa thức", description: "Sở hữu và trang bị danh hiệu từ cửa hàng", icon: "🛍️", unlocked: false },
];

const defaultStats: UserStats = {
  xp: 0,
  level: 1,
  coins: 50,
  streak: 1,
  lastActive: new Date().toISOString(),
  completedLessons: [],
  achievements: initialAchievements,
  inventory: []
};

const defaultDailyTasks = (): DailyTask[] => [
  {
    id: "task-practice",
    title: "Vượt qua 5 câu hỏi luyện tập",
    requirement: 5,
    progress: 0,
    xpReward: 30,
    coinsReward: 15,
    completed: false,
    type: "practice",
  },
  {
    id: "task-chat",
    title: "Trò chuyện với Gia sư AI 2 tin nhắn",
    requirement: 2,
    progress: 0,
    xpReward: 20,
    coinsReward: 10,
    completed: false,
    type: "chat",
  },
  {
    id: "task-game",
    title: "Đạt ít nhất 20 điểm trong Game bất kỳ",
    requirement: 20,
    progress: 0,
    xpReward: 30,
    coinsReward: 15,
    completed: false,
    type: "game",
  },
];

export class LearningRepository {
  private static STATS_KEY = "toan8_ai_stats";
  private static PROFILE_KEY = "toan8_ai_profile_new";
  private static HISTORY_KEY = "toan8_ai_history";
  private static TASKS_KEY = "toan8_ai_tasks";
  private static HIGHSCORE_KEY = "toan8_ai_highscore";

  /**
   * Loads user stats from storage
   */
  static getUserStats(): UserStats {
    const data = localStorage.getItem(this.STATS_KEY);
    if (!data) {
      this.saveUserStats(defaultStats);
      return defaultStats;
    }
    try {
      const stats = JSON.parse(data);
      // Ensure accomplishments/achievements exist
      if (!stats.achievements) stats.achievements = initialAchievements;
      return stats;
    } catch {
      return defaultStats;
    }
  }

  /**
   * Saves user stats
   */
  static saveUserStats(stats: UserStats): void {
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  }

  /**
   * Loads profile settings
   */
  static getUserProfile(): UserProfile | null {
    const data = localStorage.getItem(this.PROFILE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Saves user profile
   */
  static saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
  }

  /**
   * Loads game high score
   */
  static getHighScore(): number {
    const val = localStorage.getItem(this.HIGHSCORE_KEY);
    return val ? parseInt(val, 10) || 0 : 0;
  }

  /**
   * Saves game high score
   */
  static saveHighScore(score: number): void {
    localStorage.setItem(this.HIGHSCORE_KEY, score.toString());
  }

  /**
   * Loads learning and activity logs
   */
  static getHistory(): HistoryEntry[] {
    const data = localStorage.getItem(this.HISTORY_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  /**
   * Adds a new history record
   */
  static addHistoryEntry(entry: Omit<HistoryEntry, "id" | "date">): void {
    const history = this.getHistory();
    const newEntry: HistoryEntry = {
      ...entry,
      id: `hist-${Date.now()}`,
      date: new Date().toISOString(),
    };
    history.unshift(newEntry);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history.slice(0, 50))); // Keep last 50 entries
  }

  /**
   * Loads daily tasks list
   */
  static getDailyTasks(): DailyTask[] {
    const data = localStorage.getItem(this.TASKS_KEY);
    const lastActiveStr = this.getUserStats().lastActive;
    const today = new Date().toDateString();
    const lastActiveDate = lastActiveStr ? new Date(lastActiveStr).toDateString() : "";

    if (!data || today !== lastActiveDate) {
      // It's a new day, refresh the daily tasks
      const newTasks = defaultDailyTasks();
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(newTasks));
      return newTasks;
    }

    try {
      return JSON.parse(data);
    } catch {
      const fallback = defaultDailyTasks();
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(fallback));
      return fallback;
    }
  }

  /**
   * Increments daily task progress
   */
  static updateDailyTaskProgress(type: "practice" | "chat" | "game" | "exam", increment: number, onReward: (xp: number, coins: number) => void): DailyTask[] {
    const tasks = this.getDailyTasks();
    let updated = false;

    const nextTasks = tasks.map((task) => {
      if (task.type === type && !task.completed) {
        const newProgress = Math.min(task.progress + increment, task.requirement);
        const completedNow = newProgress >= task.requirement;
        if (completedNow) {
          onReward(task.xpReward, task.coinsReward);
        }
        updated = true;
        return {
          ...task,
          progress: newProgress,
          completed: completedNow || task.completed,
        };
      }
      return task;
    });

    if (updated) {
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(nextTasks));
    }
    return nextTasks;
  }

  /**
   * Clears database and resets everything
   */
  static resetAll(): void {
    localStorage.removeItem(this.STATS_KEY);
    localStorage.removeItem(this.PROFILE_KEY);
    localStorage.removeItem(this.HISTORY_KEY);
    localStorage.removeItem(this.TASKS_KEY);
    localStorage.removeItem(this.HIGHSCORE_KEY);
    localStorage.removeItem("toan8_ai_chat_history");
    localStorage.removeItem("toan8_ai_title");
    localStorage.removeItem("toan8_ai_avatar");
  }

  /**
   * Loads AI Chat history
   */
  static getChatHistory(defaultWelcome: any[]): any[] {
    const data = localStorage.getItem("toan8_ai_chat_history");
    if (!data) return defaultWelcome;
    try {
      return JSON.parse(data);
    } catch {
      return defaultWelcome;
    }
  }

  /**
   * Saves AI Chat history
   */
  static saveChatHistory(messages: any[]): void {
    localStorage.setItem("toan8_ai_chat_history", JSON.stringify(messages.slice(-30))); // Keep last 30 messages
  }
}
