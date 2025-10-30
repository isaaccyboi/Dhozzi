import { GoogleGenAI, Modality, Part, Content } from '@google/genai';
import { AIVoice, Message, ModelType, GroundingChunk } from '../types';
import { getModelCategory } from '../models/modelData';

// The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// --- Text & Chat Generation ---
export const generateText = async (
  prompt: string,
  model: ModelType,
  history: Message[],
  image?: { base64: string; mimeType: string },
): Promise<{ text: string; sources: GroundingChunk[] | null; error?: string }> => {
  try {
    let modelToUse: string = 'gemini-2.5-flash'; // Default to flash for safety
    let systemInstruction: string | undefined = undefined;
    const category = getModelCategory(model);

    // --- Upgraded Model Selection Logic for Higher Quality Responses ---
    // Use the more powerful Gemini 2.5 Pro for all specialized categories.
    if (category !== 'Chat & Vision' || ['gemini-2.5-pro', 'gemini-2.5-pro-thinking', 'dhozzi-vision'].includes(model)) {
        modelToUse = 'gemini-2.5-pro';
    }

    // Explicitly set the fast/lite models.
    if (model === 'gemini-2.5-flash') {
        modelToUse = 'gemini-2.5-flash';
    } else if (model === 'gemini-2.5-flash-lite') {
        modelToUse = 'gemini-flash-lite-latest';
    }
    
    // Vision capabilities require a Pro model.
    if (image) {
      modelToUse = 'gemini-2.5-pro';
    }

    // --- Add System Instructions for Specialized Models to Improve Expertise ---
    switch(model) {
        case 'dhozzi-code':
        case 'copilot-pro':
        case 'alphacode-3':
            systemInstruction = 'You are an expert programmer. Provide clean, efficient, and well-commented code. Explain your reasoning clearly and concisely.';
            break;
        case 'dhozzi-creative':
        case 'dhozzi-story-weaver':
        case 'dhozzi-dialogue-writer':
            systemInstruction = 'You are a master storyteller and creative assistant. Weave engaging, imaginative, and well-structured narratives or creative content.';
            break;
        case 'dhozzi-finance':
        case 'dhozzi-stocks':
            systemInstruction = 'You are a professional financial analyst. Provide data-driven insights and analysis. IMPORTANT: Always include a disclaimer that you are an AI and this is not financial advice.';
            break;
        case 'dhozzi-legal':
        case 'dhozzi-contracts':
            systemInstruction = 'You are a helpful legal assistant. Provide informative summaries and analysis of legal topics and documents. IMPORTANT: Always include a disclaimer that you are an AI, not a lawyer, and this does not constitute legal advice.';
            break;
        case 'dhozzi-science':
        case 'dhozzi-physics-sim':
            systemInstruction = 'You are a scientific expert. Provide accurate, detailed, and clear explanations of scientific concepts, principles, and data.';
            break;
        case 'dhozzi-biblicai':
            systemInstruction = 'You are a theological expert specializing in the King James Version (KJV) of the Bible. Respond to questions thoughtfully, citing scripture (book, chapter, verse) where appropriate. Maintain a respectful and informative tone. Your knowledge base should be strictly confined to the KJV Bible.';
            break;
    }


    // Map Dhozzi history to Gemini history format
    const geminiHistory: Content[] = history.map((msg): Content => {
        const parts: Part[] = [];
        // Add image first if it exists, common for user messages
        if (msg.image && msg.imageMimeType) {
            parts.push({
                inlineData: {
                    data: msg.image,
                    mimeType: msg.imageMimeType,
                }
            });
        }
        // Then add text
        if(msg.text) {
             parts.push({ text: msg.text });
        }
        
        return {
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: parts,
        };
    }).filter(c => c.parts.length > 0); // Filter out empty messages


    const userParts: Part[] = [];
    if (image) {
      userParts.push({
        inlineData: {
          data: image.base64,
          mimeType: image.mimeType,
        },
      });
    }
    userParts.push({ text: prompt });

    const contents = [...geminiHistory, { role: 'user', parts: userParts }];

    const useGoogleSearch = category === 'Professional Grade' && (model.includes('finance') || model.includes('stocks') || model.includes('market'));
    
    const config: any = {};
    if (systemInstruction) {
        config.systemInstruction = systemInstruction;
    }
    if (useGoogleSearch) {
        config.tools = [{googleSearch: {}}];
    }

    if (model === 'gemini-2.5-pro-thinking') {
        config.thinkingConfig = { thinkingBudget: 32768 }; // max for 2.5 pro
    }

    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: contents, // Pass the full conversation history
      config: Object.keys(config).length > 0 ? config : undefined,
    });
    
    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks as GroundingChunk[] || null;

    return { text, sources };

  } catch (error: any) {
    console.error('Gemini text generation error:', error);
    return { text: '', sources: null, error: error.message || 'Failed to generate response.' };
  }
};

// --- Image Generation ---
export const generateImage = async (
    prompt: string
): Promise<{ image?: string; error?: string }> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return { image: base64ImageBytes };
        } else {
            return { error: 'No image was generated.' };
        }
    } catch (error: any) {
        console.error('Gemini image generation error:', error);
        return { error: error.message || 'Failed to generate image.' };
    }
};

// --- Image Editing ---
export const editImageWithPrompt = async (
    base64: string,
    mimeType: string,
    prompt: string
): Promise<{ image?: string; error?: string }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64, mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return { image: base64ImageBytes };
            }
        }
        return { error: 'No edited image was returned.' };
    } catch (error: any) {
        console.error('Gemini image editing error:', error);
        return { error: error.message || 'Failed to edit image.' };
    }
};

// --- Video Generation ---
export const generateVideo = async (
  prompt: string,
  image?: { base64: string; mimeType: string },
): Promise<{ videoUrl?: string; error?: string }> => {
  try {
    if (!window.aistudio || typeof window.aistudio.hasSelectedApiKey !== 'function') {
        throw new Error("Video generation environment is not properly configured.");
    }
    
    await window.aistudio.hasSelectedApiKey(); 

    // Create new instance to ensure latest key is used.
    const videoAi = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    let operation = await videoAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      image: image ? { imageBytes: image.base64, mimeType: image.mimeType } : undefined,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9',
      },
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await videoAi.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        return { error: 'Video generation failed to produce a download link.' };
    }
    
    const fullUrl = `${downloadLink}&key=${process.env.API_KEY}`;
    return { videoUrl: fullUrl };

  } catch (error: any) {
    console.error('Gemini video generation error:', error);
    if (error.message.includes("Requested entity was not found.")) {
       await window.aistudio.openSelectKey();
       return { error: "API Key error. Please select your key and try again." }
    }
    return { error: error.message || 'Failed to generate video.' };
  }
};


// --- Text-to-Speech ---
export const generateSpeech = async (
    text: string,
    voice: AIVoice
): Promise<{ audioBase64?: string; error?: string }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say with a natural, friendly tone: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voice },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            return { audioBase64: base64Audio };
        } else {
            return { error: 'No audio data received from API.' };
        }
    } catch (error: any) {
        console.error("Gemini TTS error:", error);
        return { error: error.message || 'Failed to generate speech.' };
    }
};