// File: /app/api/generate-post/route.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { prompt, imagePart, tone, wordCount } = await request.json();
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Prepare the content parts for the API request
    let contentParts = [prompt];
    
    // If an image was provided, add it to the content parts
    if (imagePart) {
      contentParts.push({
        inlineData: {
          data: imagePart.data,
          mimeType: imagePart.mimeType
        }
      });
    }
    
    // Generate content with Gemini
    const result = await model.generateContent(contentParts);
    const response = await result.response;
    let text = response.text();
    
    // Ensure the response meets the word count requirements
    const words = text.split(/\s+/);
    if (words.length > wordCount * 1.2) {
      // Trim if too long
      text = words.slice(0, wordCount).join(' ');
    }
    
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: error.message },
      { status: 500 }
    );
  }
}