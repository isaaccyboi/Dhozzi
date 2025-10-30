// full contents of types.ts

export type Plan = 'basic' | 'premium' | 'platinum';

export type ModelType = 
  'gemini-2.5-flash' | 
  'gemini-2.5-flash-lite' |
  'gemini-2.5-pro' | 
  'gemini-2.5-pro-thinking' | 
  'dhozzi-creative' |
  'dhozzi-story-weaver' |
  'dhozzi-vision' | 
  'imagen-4.0-generate-001' | 
  'dhozzi-logo-maker' |
  'dall-e-3' |
  'firefly-2' |
  'midjourney-v6' |
  'stable-diffusion-3' |
  'veo-3.1-fast-generate-preview' |
  'dhozzi-code' |
  'copilot-pro' |
  'alphacode-3' |
  'dhozzi-finance' |
  'dhozzi-stocks' |
  'dhozzi-legal' |
  'dhozzi-contracts' |
  'dhozzi-science' |
  'dhozzi-physics-sim' |
  'dhozzi-sound-fx' |
  'dhozzi-podcast-helper' |
  'dhozzi-music-gen' |
  'dhozzi-voice-clone' |
  'dhozzi-ad-copy' |
  'dhozzi-seo-pro' |
  'dhozzi-translator' |
  'dhozzi-market-analysis' |
  'dhozzi-dialogue-writer' |
  'dhozzi-lore-master' |
  'dhozzi-game-dev' |
  'dhozzi-3d-texture' |
  'dhozzi-lesson-planner' |
  'dhozzi-tutor' |
  'dhozzi-paper-summarizer' |
  'dhozzi-biblicai' |
  'dhozzi-fitness-coach' |
  'dhozzi-mindfulness-guide' |
  'dhozzi-med-assist' |
  'dhozzi-recipe-creator' |
  'dhozzi-dream-interpreter' |
  'dhozzi-travel-planner' |
  'dhozzi-interior-design';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  image?: string; // base64
  imageMimeType?: string;
  video?: string; // url for generated video
  uploadedVideo?: { base64: string; mimeType: string };
  uploadedAudio?: { base64: string; mimeType: string };
  isError?: boolean;
  sources?: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: { reviewSnippets: { uri: string; text: string }[] }[];
  };
}

export interface HistoryItem {
    id: string;
    name: string;
    type: 'chat' | 'folder';
    // For folders
    isOpen?: boolean;
    items?: HistoryItem[];
    // For chats
    messages?: Message[];
    model?: ModelType;
    date: string;
}

export interface DhozziUser {
  uid: string;
  email: string;
  plan: Plan;
  krxBalance: number;
  lastLoginDate: string; // YYYY-MM-DD format
  streak: number;
  planActiveUntil: string | null; // ISO string date
}

export type AIVoice = 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';

// FIX: To resolve conflicting global declarations for 'window.aistudio',
// we define the AIStudio interface and apply it to the Window interface within
// the global scope. This prevents module-scoping issues with TypeScript.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // FIX: Made aistudio optional to resolve a declaration conflict where other global definitions may exist.
    aistudio?: AIStudio;
  }
}