
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export const verifyFace = async (
  referenceImageBase64: string,
  currentCaptureBase64: string
): Promise<{ verified: boolean; confidence: number; message: string }> => {
  try {
    // Initialize AI client inside the function to ensure it uses the latest process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Clean base64 strings (remove data:image/jpeg;base64, prefix)
    const refData = referenceImageBase64.includes(',') ? referenceImageBase64.split(',')[1] : referenceImageBase64;
    const curData = currentCaptureBase64.includes(',') ? currentCaptureBase64.split(',')[1] : currentCaptureBase64;

    const prompt = `
      Compare ces deux images. 
      La première image est la photo de référence d'un étudiant. 
      La deuxième image est une capture en direct pour l'appel.
      Détermine s'il s'agit de la même personne.
      
      Réponds UNIQUEMENT au format JSON :
      {
        "verified": boolean,
        "confidence": number (entre 0 et 1),
        "reason": "explication courte"
      }
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: refData, mimeType: 'image/jpeg' } },
          { inlineData: { data: curData, mimeType: 'image/jpeg' } }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Réponse vide du modèle.");
    }

    const result = JSON.parse(responseText.trim());
    return {
      verified: result.verified ?? false,
      confidence: result.confidence ?? 0,
      message: result.reason ?? "Vérification terminée."
    };
  } catch (error) {
    console.error("Erreur de vérification faciale Gemini:", error);
    return { 
      verified: false, 
      confidence: 0, 
      message: "Une erreur est survenue lors de la vérification IA. Vérifiez votre connexion et votre clé API." 
    };
  }
};
