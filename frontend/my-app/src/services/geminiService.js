import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client using the provided API key
const API_KEY = 'AIzaSyCDJFB6DRXhY2UrhJToTs_W0PsNkAT46IQ';
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiService = {
  /**
   * Search for cities using Gemini
   * @param {string} query 
   * @returns {Promise<Array>}
   */
  async searchCities(query) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Return a JSON array of 6 beautiful, popular travel destination cities matching the search query or theme: "${query}". 
      Each object must have the following exact properties:
      "id": a unique integer,
      "name": name of the city,
      "country": name of the country,
      "image": a high quality matching Unsplash image URL (e.g., https://images.unsplash.com/photo-1502602861271-e970a25df600?auto=format&fit=crop&q=80&w=600),
      "rating": a realistic rating between 4.0 and 5.0,
      "costIndex": a cost indicator string ranging from "$" to "$$$$".
      
      Output ONLY valid JSON. Do not use markdown blocks (e.g. \`\`\`json). Return the raw array starting with [ and ending with ].`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      // Clean up markdown if the AI includes it despite instructions
      if (text.startsWith('```json')) {
        text = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
      }

      return JSON.parse(text);
    } catch (error) {
      console.error('Gemini City Search Error:', error);
      throw new Error('Failed to generate cities. Please try again.');
    }
  },

  /**
   * Search for activities in a specific city
   * @param {string} city 
   * @param {string} type 
   * @returns {Promise<Array>}
   */
  async searchActivities(city, type) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Return a JSON array of 5 interesting and popular travel activities in ${city} that match the category: "${type}". 
      Each object must have the following exact properties:
      "id": a unique integer,
      "title": name of the activity,
      "description": a short, exciting 1-2 sentence description,
      "duration": duration in minutes (integer),
      "cost": estimated cost in USD (integer),
      "type": the category ("${type}"),
      "rating": a realistic rating between 4.0 and 5.0.

      Output ONLY valid JSON. Do not use markdown blocks (e.g. \`\`\`json). Return the raw array starting with [ and ending with ].`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      if (text.startsWith('```json')) {
        text = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
      }

      return JSON.parse(text);
    } catch (error) {
      console.error('Gemini Activity Search Error:', error);
      throw new Error('Failed to generate activities. Please try again.');
    }
  }
};
