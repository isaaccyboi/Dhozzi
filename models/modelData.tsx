import React from 'react';
import { ModelType, Plan } from '../types';
import { 
    DhozziChatIcon, 
    DhozziProIcon,
    DhozziUltraIcon,
    DhozziVisionIcon, 
    DhozziCodeIcon, 
    ImagenIcon,
    DalleIcon,
    MidjourneyIcon,
    VeoIcon,
    AlphaCodeIcon,
    DhozziFinanceIcon,
    DhozziLegalIcon,
    DhozziScienceIcon,
    AudioIcon,
    MusicIcon,
    BusinessIcon,
    GameIcon,
    ThreeDIcon,
    EducationIcon,
    HealthIcon,
    LifestyleIcon,
    GlobeIcon,
    SparklesIcon,
    BookOpenIcon
} from '../components/Icons';

export interface ModelDefinition {
  id: ModelType;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  minPlan: Plan;
}

const iconClass = "w-5 h-5 text-gray-400";

export const allModels: ModelDefinition[] = [
  // --- Chat & Vision Models ---
  {
    id: 'gemini-2.5-flash',
    name: 'Dhozzi (Flash)',
    description: 'Fast, efficient, and great for everyday tasks.',
    icon: <DhozziChatIcon className={iconClass}/>,
    category: 'Chat & Vision',
    minPlan: 'basic',
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Dhozzi (Flash Lite)',
    description: 'For the fastest, low-latency conversations.',
    icon: <SparklesIcon className={`${iconClass} text-cyan-400`} />,
    category: 'Chat & Vision',
    minPlan: 'premium',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Advanced model for complex reasoning and analysis.',
    icon: <DhozziProIcon className={iconClass} />,
    category: 'Chat & Vision',
    minPlan: 'premium',
  },
  {
    id: 'gemini-2.5-pro-thinking',
    name: 'Gemini 2.5 Pro (Thinking)',
    description: 'Max reasoning for the toughest problems.',
    icon: <DhozziUltraIcon className={`${iconClass} text-fuchsia-400`} />,
    category: 'Chat & Vision',
    minPlan: 'platinum',
  },
  {
    id: 'dhozzi-vision',
    name: 'Dhozzi Vision',
    description: 'Analyze and understand images, video, and audio.',
    icon: <DhozziVisionIcon className={iconClass} />,
    category: 'Chat & Vision',
    minPlan: 'premium',
  },
  // --- Image Creation ---
  {
    id: 'imagen-4.0-generate-001',
    name: 'Imagen 4.0',
    description: 'Create stunning, photorealistic images from text.',
    icon: <ImagenIcon className={iconClass} />,
    category: 'Image Creation',
    minPlan: 'basic',
  },
  {
    id: 'dhozzi-logo-maker',
    name: 'Logo Maker',
    description: 'Generate unique vector-style logo concepts.',
    icon: <ImagenIcon className={`${iconClass} text-blue-400`} />,
    category: 'Image Creation',
    minPlan: 'premium',
  },
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    description: 'A highly creative model for unique, artistic visuals.',
    icon: <DalleIcon className={iconClass} />,
    category: 'Image Creation',
    minPlan: 'premium',
  },
    {
    id: 'firefly-2',
    name: 'Firefly 2',
    description: 'Adobe\'s model, great for commercially safe images.',
    icon: <DalleIcon className={`${iconClass} text-red-400`} />,
    category: 'Image Creation',
    minPlan: 'premium',
  },
  {
    id: 'midjourney-v6',
    name: 'Midjourney v6',
    description: 'The standard for beautiful, imaginative artwork.',
    icon: <MidjourneyIcon className={iconClass} />,
    category: 'Image Creation',
    minPlan: 'platinum',
  },
    {
    id: 'stable-diffusion-3',
    name: 'Stable Diffusion 3',
    description: 'Advanced open-source model with high customization.',
    icon: <MidjourneyIcon className={`${iconClass} text-purple-400`} />,
    category: 'Image Creation',
    minPlan: 'platinum',
  },
  // --- Video Generation ---
  {
    id: 'veo-3.1-fast-generate-preview',
    name: 'Veo Video Generation',
    description: 'Generate high-quality video from text or images.',
    icon: <VeoIcon className={iconClass} />,
    category: 'Video Generation',
    minPlan: 'platinum',
  },
  // --- Professional Grade ---
  {
    id: 'dhozzi-code',
    name: 'Dhozzi Code',
    description: 'Your coding sidekick for writing and fixing code.',
    icon: <DhozziCodeIcon className={iconClass} />,
    category: 'Professional Grade',
    minPlan: 'premium',
  },
  {
    id: 'copilot-pro',
    name: 'Copilot Pro',
    description: 'Advanced code completion and project analysis.',
    icon: <DhozziCodeIcon className={`${iconClass} text-sky-400`} />,
    category: 'Professional Grade',
    minPlan: 'premium',
  },
  {
    id: 'alphacode-3',
    name: 'AlphaCode 3',
    description: 'Elite-level coding for competitive programming.',
    icon: <AlphaCodeIcon className={iconClass} />,
    category: 'Professional Grade',
    minPlan: 'platinum',
  },
  {
    id: 'dhozzi-finance',
    name: 'Dhozzi Finance',
    description: 'Expert analysis for financial data and markets.',
    icon: <DhozziFinanceIcon className={iconClass} />,
    category: 'Professional Grade',
    minPlan: 'platinum',
  },
  {
    id: 'dhozzi-stocks',
    name: 'Dhozzi Stocks',
    description: 'Deep dive into stock performance and indicators.',
    icon: <DhozziFinanceIcon className={`${iconClass} text-green-400`} />,
    category: 'Professional Grade',
    minPlan: 'platinum',
  },
  {
    id: 'dhozzi-legal',
    name: 'Dhozzi Legal',
    description: 'Assists with legal document summary and research.',
    icon: <DhozziLegalIcon className={iconClass} />,
    category: 'Professional Grade',
    minPlan: 'platinum',
  },
  {
    id: 'dhozzi-contracts',
    name: 'Dhozzi Contracts',
    description: 'Analyze and review legal contract clauses.',
    icon: <DhozziLegalIcon className={`${iconClass} text-yellow-400`} />,
    category: 'Professional Grade',
    minPlan: 'platinum',
  },
  {
    id: 'dhozzi-science',
    name: 'Dhozzi Science',
    description: 'For scientific research, data, and literature.',
    icon: <DhozziScienceIcon className={iconClass} />,
    category: 'Professional Grade',
    minPlan: 'platinum',
  },
  {
    id: 'dhozzi-physics-sim',
    name: 'Dhozzi Physics Sim',
    description: 'Simulate and explain complex physics problems.',
    icon: <DhozziScienceIcon className={`${iconClass} text-blue-400`} />,
    category: 'Professional Grade',
    minPlan: 'platinum',
  },
  // --- Audio & Music ---
  {
    id: 'dhozzi-sound-fx',
    name: 'Sound FX',
    description: 'Generate sound effects from a text description.',
    icon: <AudioIcon className={iconClass} />,
    category: 'Audio & Music',
    minPlan: 'premium',
  },
  {
    id: 'dhozzi-podcast-helper',
    name: 'Podcast Helper',
    description: 'Generate scripts, intros, and topic ideas.',
    icon: <AudioIcon className={`${iconClass} text-orange-400`} />,
    category: 'Audio & Music',
    minPlan: 'premium',
  },
  {
    id: 'dhozzi-music-gen',
    name: 'Music Gen',
    description: 'Create royalty-free music in various genres.',
    icon: <MusicIcon className={iconClass} />,
    category: 'Audio & Music',
    minPlan: 'platinum',
  },
  {
    id: 'dhozzi-voice-clone',
    name: 'Voice Clone',
    description: '(Preview) Clone a voice from a short audio sample.',
    icon: <MusicIcon className={`${iconClass} text-red-400`} />,
    category: 'Audio & Music',
    minPlan: 'platinum',
  },
  // --- Business & Marketing ---
  {
    id: 'dhozzi-ad-copy',
    name: 'Ad Copy Pro',
    description: 'Write compelling copy for digital advertisements.',
    icon: <BusinessIcon className={iconClass} />,
    category: 'Business & Marketing',
    minPlan: 'premium',
  },
  {
    id: 'dhozzi-seo-pro',
    name: 'SEO Pro',
    description: 'Optimize content with keyword and topic suggestions.',
    icon: <BusinessIcon className={`${iconClass} text-green-400`} />,
    category: 'Business & Marketing',
    minPlan: 'premium',
  },
  {
    id: 'dhozzi-translator',
    name: 'Translator',
    description: 'Translate text between dozens of languages.',
    icon: <GlobeIcon className={iconClass} />,
    category: 'Business & Marketing',
    minPlan: 'premium',
  },
  {
    id: 'dhozzi-market-analysis',
    name: 'Market Analysis',
    description: 'Analyze market trends and business strategies.',
    icon: <BusinessIcon className={`${iconClass} text-blue-400`} />,
    category: 'Business & Marketing',
    minPlan: 'platinum',
  },
  // --- Gaming & 3D ---
  {
    id: 'dhozzi-dialogue-writer',
    name: 'Dialogue Writer',
    description: 'Create branching dialogues for game characters.',
    icon: <GameIcon className={iconClass} />,
    category: 'Gaming & 3D',
    minPlan: 'premium',
  },
  {
    id: 'dhozzi-lore-master',
    name: 'Lore Master',
    description: 'Generate rich backstories and world-building details.',
    icon: <GameIcon className={`${iconClass} text-purple-400`} />,
    category: 'Gaming & 3D',
    minPlan: 'premium',
  },
  {
    id: 'dhozzi-game-dev',
    name: 'Game Dev Helper',
    description: 'Assistance with game logic, mechanics, and code.',
    icon: <GameIcon className={`${iconClass} text-orange-400`} />,
    category: 'Gaming & 3D',
    minPlan: 'platinum',
  },
  {
    id: 'dhozzi-3d-texture',
    name: '3D Texture Gen',
    description: 'Generate seamless textures for 3D models.',
    icon: <ThreeDIcon className={iconClass} />,
    category: 'Gaming & 3D',
    minPlan: 'platinum',
  },
  // --- Education & Research ---
  {
    id: 'dhozzi-lesson-planner',
    name: 'Lesson Planner',
    description: 'Create educational outlines and activities.',
    icon: <EducationIcon className={iconClass} />,
    category: 'Education & Research',
    minPlan: 'premium',
  },
  {
    id: 'dhozzi-tutor',
    name: 'AI Tutor',
    description: 'Get explanations for complex topics.',
    icon: <EducationIcon className={`${iconClass} text-blue-400`} />,
    category: 'Education & Research',
    minPlan: 'premium',
  },
  {
    id: 'dhozzi-paper-summarizer',
    name: 'Paper Summarizer',
    description: 'Summarize long academic papers and articles.',
    icon: <EducationIcon className={`${iconClass} text-yellow-400`} />,
    category: 'Education & Research',
    minPlan: 'premium',
  },
  {
    id: 'dhozzi-biblicai',
    name: 'Biblicai',
    description: 'Chat with the King James Bible. Ask questions and get insights.',
    icon: <BookOpenIcon className={iconClass} />,
    category: 'Education & Research',
    minPlan: 'basic',
  },
  // --- Health & Wellness ---
  {
    id: 'dhozzi-fitness-coach',
    name: 'Fitness Coach',
    description: 'Generate workout plans and fitness advice.',
    icon: <HealthIcon className={iconClass} />,
    category: 'Health & Wellness',
    minPlan: 'premium',
  },
  {
    id: 'dhozzi-mindfulness-guide',
    name: 'Mindfulness Guide',
    description: 'Get guided meditation and mindfulness scripts.',
    icon: <HealthIcon className={`${iconClass} text-purple-400`} />,
    category: 'Health & Wellness',
    minPlan: 'premium',
  },
  {
    id: 'dhozzi-med-assist',
    name: 'Med Assist',
    description: 'Medical info summary (not a substitute for a doctor).',
    icon: <HealthIcon className={`${iconClass} text-red-400`} />,
    category: 'Health & Wellness',
    minPlan: 'platinum',
  },
  // --- Lifestyle & Fun ---
  {
    id: 'dhozzi-recipe-creator',
    name: 'Recipe Creator',
    description: 'Generate new recipes based on ingredients.',
    icon: <LifestyleIcon className={iconClass} />,
    category: 'Lifestyle & Fun',
    minPlan: 'basic',
  },
  {
    id: 'dhozzi-dream-interpreter',
    name: 'Dream Interpreter',
    description: 'Explore possible meanings of your dreams.',
    icon: <LifestyleIcon className={`${iconClass} text-purple-400`} />,
    category: 'Lifestyle & Fun',
    minPlan: 'basic',
  },
  {
    id: 'dhozzi-travel-planner',
    name: 'Travel Planner',
    description: 'Create detailed itineraries for your next trip.',
    icon: <LifestyleIcon className={`${iconClass} text-sky-400`} />,
    category: 'Lifestyle & Fun',
    minPlan: 'premium',
  },
  {
    id: 'dhozzi-interior-design',
    name: 'Interior Designer',
    description: 'Get ideas and concepts for your home decor.',
    icon: <LifestyleIcon className={`${iconClass} text-green-400`} />,
    category: 'Lifestyle & Fun',
    minPlan: 'premium',
  },
];

const planHierarchy: Record<Plan, number> = {
  'basic': 0,
  'premium': 1,
  'platinum': 2,
};

export const getAvailableModels = (plan: Plan | null): ModelDefinition[] => {
  const currentPlan = plan ?? 'basic';
  const userLevel = planHierarchy[currentPlan];

  return allModels.filter(model => {
      const modelLevel = planHierarchy[model.minPlan];
      return userLevel >= modelLevel;
  });
};

export const getModelCategory = (modelId: ModelType): string => {
    const model = allModels.find(m => m.id === modelId);
    return model ? model.category : 'Unknown';
}