import { whisper } from "whisper-node";

/**
 * Transcribes the audio file at the given path.
 * @param {string} audioFilePath - Absolute path to the audio file.
 * @returns {Promise<Array>} - Transcription result as an array of objects.
 */
export const transcribeAudio = async (audioFilePath) => {
  try {
    console.log("[Sidecar] Transcribing:", audioFilePath);

    const transcript = await whisper(audioFilePath, {
      modelName: "medium",
      language: "en",
    });

    console.log("[Sidecar] Transcription complete.");
    console.log("[Sidecar] Transcript result:", transcript); // Add this line

    return transcript;
  } catch (error) {
    console.error("[Sidecar] Error during transcription:", error);
    throw error;
  }
};
