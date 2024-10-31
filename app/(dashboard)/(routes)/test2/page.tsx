import { NextResponse } from "next/server"; // For handling responses
import fs from "fs"; // File system to handle file operations
import path from "path"; // Module for handling file paths
import { OpenAIApi, Configuration } from "openai"; // Importing OpenAI API classes

// Configuration for OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Load API key from environment variables
});

// Create an instance of OpenAIApi
const openai = new OpenAIApi(configuration);

// Define the path for saving the speech audio file
const speechFile = path.resolve("./public/speech.mp3");

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the incoming JSON request
    const { input } = body; // Extract input text

    // Validate input
    if (!input) {
      return new NextResponse("Input text is required", { status: 400 });
    }

    // Generate speech using the appropriate API call
    const response = await openai.createModeration({
      model: "text-to-speech", // Ensure to replace with the correct model name
      input: input,
    });

    // Save the audio data to a file
    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    // Respond with the URL to access the audio file
    return NextResponse.json({ audioUrl: "/speech.mp3" });
  } catch (error) {
    console.error('[TTS_ERROR]', error); // Log the error
    return new NextResponse("Internal Error", { status: 500 });
  }
}
