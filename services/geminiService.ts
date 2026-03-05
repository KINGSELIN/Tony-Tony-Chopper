
import { GoogleGenAI, Type } from "@google/genai";
import { ReportInsight, RiskPrediction, UserProfile, DailyLog } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeMedicalReport = async (reportText: string, imageBase64?: string): Promise<ReportInsight> => {
  const ai = getAIClient();
  
  const parts: any[] = [
    {
      text: `
        You are the "Bone Insight AI" (Pathology Precision Mode) for the CHOPPER Osteoporosis Support System.
        Analyze the following medical data (DEXA scan/lab results).
        Provide a quantitative summary, extract key metrics like T-Score, and identify specific Anatomical Regions of Interest (ROI).
        
        CRITICAL: 
        1. Provide a detailed "Executive Summary" that explains the results in plain English but with clinical precision.
        2. Give specific, actionable "Solutions" and "Daily Necessities" based on the findings (e.g., specific exercises, exact calcium/Vit D targets).
        3. Identify anatomical regions (L1-L4, Femoral Neck, etc.) with severity levels.
        4. If T-Score is below -2.5, categorize as Osteoporosis. If between -1.0 and -2.5, Osteopenia.
        
        Report Data:
        ${reportText}
      `
    }
  ];

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            type: { type: Type.STRING },
            tScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            solutions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific clinical solutions and daily necessities"
            },
            regions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  severity: { type: Type.STRING, description: "normal, low, or critical" },
                  confidence: { type: Type.NUMBER }
                }
              }
            }
          },
          required: ['date', 'type', 'summary', 'recommendations', 'solutions']
        }
      }
    });

    return JSON.parse(response.text || '{}') as ReportInsight;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    throw error;
  }
};

export const calculateOsteoporosisRisk = async (profile: UserProfile, logs: DailyLog[]): Promise<RiskPrediction> => {
  const ai = getAIClient();
  const recentLogs = logs.slice(0, 5);
  
  const prompt = `
    Analyze the risk of Osteoporosis for this user based on parameters from the "Osteoporosis Risk Prediction Dataset" (Kaggle).
    
    User Profile:
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - BMI Parameters: Height ${profile.height}cm, Weight ${profile.weight}kg
    
    Recent Health Data:
    ${recentLogs.map(l => `- Date: ${l.date}, Calcium: ${l.calciumIntake}mg, Vit D: ${l.vitaminD}IU, Activity: ${l.activityMinutes}min`).join('\n')}
    
    Tasks:
    1. Calculate a risk score (0-100).
    2. Determine a risk label (Low, Moderate, High).
    3. Identify specific contributing factors (Age, Gender, Calcium Intake, Physical Activity, BMI).
    4. Provide clinical recommendations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            label: { type: Type.STRING, description: "Low, Moderate, or High" },
            factors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  impact: { type: Type.STRING, description: "positive, negative, or neutral" },
                  value: { type: Type.STRING }
                }
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['score', 'label', 'factors', 'recommendations']
        }
      }
    });

    return JSON.parse(response.text || '{}') as RiskPrediction;
  } catch (error) {
    console.error("Risk prediction failed:", error);
    return {
      score: 50,
      label: 'Moderate',
      factors: [],
      recommendations: ["Consult a physician for a formal risk assessment."]
    };
  }
};

export const chatWithAI = async (
  message: string, 
  context: string, 
  preferredLanguage: string, 
  isComplex: boolean = false
): Promise<string> => {
  const ai = getAIClient();
  
  const modelName = isComplex ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  const thinkingConfig = isComplex ? { thinkingBudget: 32768 } : undefined;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: `
      User Message: ${message}
      Current User Context: ${context}
      User Preferred Language: ${preferredLanguage}
      
      System Role: You are CHOPPER, a PathAI-level high-precision diagnostic coach.
      Response Style:
      1. Precision: Use quantitative data where possible.
      2. Visual: Refer to specific anatomical structures (L1-L4, Femoral Neck).
      3. Structure: Emphasize "Clinical Observations" and "Quantitative Metrics".
      4. Support Language: ${preferredLanguage}. 
      
      Always include a brief safety disclaimer: "Note: I am a diagnostic support AI. Consult a human specialist for formal diagnosis."
    `,
    config: {
      systemInstruction: "High-precision clinical AI coach. Emphasis on quantitative bone mineral density data and anatomical specificity.",
      thinkingConfig: thinkingConfig
    }
  });

  return response.text || "I'm sorry, I couldn't process that.";
};

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Audio
          }
        },
        {
          text: "Transcribe this audio precisely. Return only the transcription text."
        }
      ]
    }
  });
  return response.text || "";
};
