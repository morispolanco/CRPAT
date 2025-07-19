import { GoogleGenAI } from "@google/genai";
import type { AppIdeaRequest, GeneratedPrompt } from '../types';

// Assumes process.env.API_KEY is set in the environment where this code runs.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildFinalPrompt = (request: AppIdeaRequest): string => {
    return `
      **TAREA:**
      Tu rol es el de un estratega de producto y experto en innovación de primer nivel. A partir del campo, industria o profesión proporcionado por el usuario, debes realizar el siguiente proceso:
      1.  **Analizar el Campo:** Entiende el campo proporcionado ("${request.idea}").
      2.  **Identificar un Problema Clave:** Detecta un problema, necesidad o punto de dolor específico y significativo que aún no esté bien resuelto por la tecnología actual.
      3.  **Conceptualizar una Solución de App:** Diseña una idea de aplicación innovadora (móvil o web) que aborde directamente el problema identificado.
      4.  **Generar un Prompt C.R.P.A.T.:** Estructura tu análisis y la idea de la aplicación en un prompt completo y detallado utilizando la metodología "C.R.P.A.T.". Este prompt final debe ser tan completo que pueda ser entregado a un equipo de desarrollo para iniciar el proyecto.

      **IDIOMA:**
      La respuesta final y todo su contenido deben estar redactados exclusivamente en español.

      **METODOLOGÍA C.R.P.A.T. A UTILIZAR PARA EL OUTPUT:**
      - **Contexto (Context):** Describe el estado actual del mercado en ese campo y por qué existe una oportunidad para una nueva solución tecnológica.
      - **Rol (Role):** Define el rol experto que un equipo de desarrollo (o un LLM) debería asumir para construir esta aplicación (ej. "Sois un equipo de desarrollo ágil especializado en apps de salud...").
      - **Problema (Problem):** Describe detalladamente el problema, necesidad o punto de dolor específico y significativo que la aplicación resolverá. Sé muy claro sobre a quién afecta y por qué es importante.
      - **Aplicación (Application/Solution):** Describe la solución. Dale un nombre pegadizo a la app. Detalla sus características principales, cómo funciona y cuál es su propuesta de valor única que la diferencia de otras posibles soluciones.
      - **Público Objetivo (Target Audience):** Describe detalladamente quiénes son los usuarios finales de la aplicación.

      **CAMPO PROPORCIONADO POR EL USUARIO:**
      "${request.idea}"

      ---
      Ahora, ejecuta la tarea. Tu respuesta debe ser *únicamente* el prompt C.R.P.A.T. final, completamente en español. No incluyas explicaciones previas ni texto conversacional. Comienza directamente con la sección "Contexto:".
    `;
};

export const generateCreativePrompt = async (request: AppIdeaRequest): Promise<GeneratedPrompt> => {
  try {
    const metaPrompt = buildFinalPrompt(request);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: metaPrompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      }
    });

    const text = response.text;
    if (!text || text.trim().length === 0) {
        throw new Error("La API no devolvió contenido. Inténtalo de nuevo con otros parámetros.");
    }
    return text.trim();

  } catch (error) {
    console.error("Error al generar el prompt:", error);
    if (error instanceof Error) {
        return `Error: ${error.message}`;
    }
    return "Ocurrió un error inesperado al contactar la API.";
  }
};