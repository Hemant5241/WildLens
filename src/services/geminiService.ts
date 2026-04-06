import { GoogleGenAI } from '@google/genai';
import type { AnalysisResult } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ANALYSIS_PROMPT = `You are WildLens, an advanced AI wildlife identification system. Analyze the provided image and identify the animal/creature in it.

Respond ONLY with valid JSON (no markdown, no code blocks, no extra text) in this exact format:
{
  "commonName": "Common name of the species",
  "scientificName": "Scientific/Latin name",
  "alternateNames": ["Other common names", "Regional names"],
  "category": "Category like Reptile, Mammal, Bird, Insect, Amphibian, Fish, Arachnid, etc.",
  "isDangerous": true/false,
  "dangerLevel": "Critical/High/Medium/Low/None",
  "venomousStatus": "VENOMOUS/NON-VENOMOUS/MILDLY VENOMOUS/N/A",
  "confidence": 95,
  "habitat": "Detailed habitat description (2-3 sentences)",
  "behavior": "Detailed behavioral description (2-3 sentences)",
  "dangerProfile": {
    "threatType": "Type of threat (e.g., Venomous Bite, Sharp Claws, Aggressive, Harmless)",
    "threatLevel": "Critical/High/Medium/Low/None",
    "actionRequired": "Recommended action (e.g., Seek ER Immediately, Maintain Distance, Safe to Observe)"
  },
  "firstAid": {
    "whatToDo": ["Step 1", "Step 2", "Step 3", "Step 4"],
    "whatNotToDo": ["Don't do 1", "Don't do 2", "Don't do 3"]
  },
  "conservationStatus": {
    "iucnStatus": "IUCN status (e.g., Least Concern, Vulnerable, Endangered, Critically Endangered)",
    "populationTrend": "Increasing/Stable/Decreasing/Unknown",
    "keyThreats": ["Threat 1", "Threat 2", "Threat 3"]
  },
  "funFacts": ["Interesting fact 1", "Interesting fact 2", "Interesting fact 3"],
  "dietInfo": "Brief diet description",
  "lifespanInfo": "Brief lifespan info",
  "sizeInfo": "Brief size/weight info"
}

If the image does not clearly contain an animal, still try your best to identify whatever creature or organism is present. Be thorough and accurate.`;

export async function analyzeImage(imageBase64: string, mimeType: string): Promise<AnalysisResult> {
  if (!API_KEY) {
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

  let response;
  try {
    response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: ANALYSIS_PROMPT },
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: base64Data,
              },
            },
          ],
        },
      ],
    });
  } catch (err) {
    if (err instanceof Error && (err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED') || err.message.includes('quota'))) {
      throw new Error('API Quota Exceeded: Your Google Gemini API key has reached its usage limit. Please check your billing details or create a new key.');
    }
    throw err;
  }

  const text = response.text || '';
  
  // Clean up the response - remove any markdown code blocks
  let cleanedText = text.trim();
  if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    const result: AnalysisResult = JSON.parse(cleanedText);
    return result;
  } catch {
    console.error('Failed to parse AI response:', cleanedText);
    throw new Error('Failed to parse the AI analysis response. Please try again.');
  }
}
