import { DhozziUser, HistoryItem } from '../types';
import { simpleUUID } from './helpers';

const USERS_KEY = 'dhozzi_users';
const CURRENT_USER_UID_KEY = 'dhozzi_currentUserUid';

// --- Helper Functions ---

const getUsers = (): DhozziUser[] => {
    try {
        const usersJson = localStorage.getItem(USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (e) {
        return [];
    }
};

const saveUsers = (users: DhozziUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// --- Auth Functions ---

export const signUp = async (email: string, password?: string): Promise<DhozziUser> => {
    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
        throw new Error("An account with this email already exists.");
    }
    
    const newUser: DhozziUser = {
        uid: simpleUUID(),
        email: email,
        plan: 'basic',
        krxBalance: 30,
        lastLoginDate: '1970-01-01',
        streak: 0,
        planActiveUntil: null,
    };
    
    // Create initial chat for the new user
    const initialChatId = simpleUUID();
    const initialHistory: HistoryItem[] = [{
        id: initialChatId,
        name: "Welcome Chat",
        type: 'chat',
        messages: [],
        model: 'gemini-2.5-flash',
        date: new Date().toISOString()
    }];
    localStorage.setItem(`dhozzi_history_${newUser.uid}`, JSON.stringify(initialHistory));

    // Save new user and set as current
    saveUsers([...users, newUser]);
    localStorage.setItem(CURRENT_USER_UID_KEY, newUser.uid);
    
    return newUser;
};

export const signIn = async (email: string, password?: string): Promise<DhozziUser> => {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        throw new Error("No account found with this email. Please sign up.");
    }
    
    // For local storage, we skip password validation.
    localStorage.setItem(CURRENT_USER_UID_KEY, user.uid);
    return user;
};

export const signOutUser = async (): Promise<void> => {
    localStorage.removeItem(CURRENT_USER_UID_KEY);
};

export const getCurrentUser = async (): Promise<DhozziUser | null> => {
    const uid = localStorage.getItem(CURRENT_USER_UID_KEY);
    if (!uid) return null;
    return getDhozziUser(uid);
};


// --- Firestore User Profile Functions (Now Local Storage) ---

export const getDhozziUser = async (uid: string): Promise<DhozziUser | null> => {
    const users = getUsers();
    return users.find(u => u.uid === uid) || null;
};

export const updateDhozziUser = async (uid: string, data: Partial<DhozziUser>): Promise<void> => {
    let users = getUsers();
    const userIndex = users.findIndex(u => u.uid === uid);
    if (userIndex > -1) {
        users[userIndex] = { ...users[userIndex], ...data };
        saveUsers(users);
    }
};


// --- Daily Rewards and Streaks ---

const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const handleDailyLogin = (user: DhozziUser): { user: DhozziUser, needsUpdate: boolean } => {
    const today = getTodayDateString();
    let needsUpdate = false;
    
    const newUser = { ...user };

    // Check for plan expiration first
    if (newUser.plan !== 'basic' && newUser.planActiveUntil && new Date() > new Date(newUser.planActiveUntil)) {
        newUser.plan = 'basic';
        newUser.planActiveUntil = null;
        needsUpdate = true;
    }

    // Already logged in today
    if (user.lastLoginDate === today) {
        return { user: newUser, needsUpdate };
    }
    
    needsUpdate = true; // Needs update for login rewards
    
    // 1. Calculate Streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    if (user.lastLoginDate === yesterdayString) {
        newUser.streak += 1;
    } else {
        newUser.streak = 1;
    }
    
    // 2. Calculate Daily KRX
    const streakBonus = Math.min(30, newUser.streak); // Max +30 bonus KRX
    const dailyEarning = 30 + streakBonus;
    newUser.krxBalance += dailyEarning;

    // 3. Check for Weekly Bonus
    if (newUser.streak > 0 && newUser.streak % 7 === 0) {
        newUser.krxBalance += 90;
    }

    // 4. Update Login Date
    newUser.lastLoginDate = today;

    return { user: newUser, needsUpdate };
};