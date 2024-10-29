import fs from "fs";
import path from "path";
import { transcribeAudio } from "./whisperHandler.js";

/**
 * Initializes and validates the paths for the audio file and output file.
 *
 * This function checks if the provided audio file path argument is an absolute path.
 * If not, it logs an error message and exits the process. It then constructs the
 * directory and filename for the audio file, and generates the absolute path for
 * the output file.
 *
 * @returns {Object} An object containing the absolute paths for the audio file and the output file.
 * @property {string} audioFilePathAbs - The absolute path to the audio file.
 * @property {string} outputFilePathAbs - The absolute path to the output file.
 *
 * @throws Will exit the process with code 1 if the audio file path argument is not provided or is not an absolute path.
 */
const initPaths = () => {
  const audioFilePathArg = process.argv[2];

  // Abs path required due to a bug in whisper-node:
  // https://github.com/ariym/whisper-node/issues/51
  if (!audioFilePathArg || !path.isAbsolute(audioFilePathArg)) {
    console.error(
      "Please provide an absolute path to the audio file as an argument."
    );
    console.error("Example: node main.js /full/path/to/audio.wav");
    process.exit(1);
  }

  const audioFileDir = path.dirname(audioFilePathArg);
  const audioFileName = path.basename(audioFilePathArg);
  const outputFilePathAbs = path.join(audioFileDir, `${audioFileName}.txt`);

  console.log("[Main] Using absolute path:", audioFilePathArg);
  console.log("[Main] Output file path:", outputFilePathAbs);

  return { audioFilePathAbs: audioFilePathArg, outputFilePathAbs };
};

/**
 * Extracts and concatenates speech text from an array of transcript objects.
 *
 * @param {Array} transcript - An array of objects, each containing a `speech` property.
 * @returns {string} The concatenated speech text. Returns an empty string if the input is invalid or empty.
 *
 * @example
 * const transcript = [
 *   { speech: "Hello" },
 *   { speech: "world" },
 *   { speech: "!" }
 * ];
 * const text = extractText(transcript);
 * // Output: "Hello world!"
 */
const extractText = (transcript) => {
  if (!Array.isArray(transcript) || transcript.length === 0) {
    console.error("[Main] Error: Transcript is empty or invalid.");
    return "";
  }

  const extractedText = transcript
    .map((obj) => obj.speech)
    .reduce(
      (acc, word) =>
        ["!", "?", ".", ","].includes(word) ? acc + word : acc + " " + word,
      ""
    );

  console.log("[Main] Extracted Text:", extractedText);
  return extractedText;
};

/**
 * Writes the given text to a file at the specified output file path.
 *
 * @param {string} outputFilePath - The path where the file will be written.
 * @param {string} text - The text content to be written to the file.
 */
const writeToFile = (outputFilePath, text) => {
  fs.writeFileSync(outputFilePath, JSON.stringify(text), "utf8");
  console.log("[Main] Transcription saved to:", outputFilePath);
};

/**
 * Main function to handle the transcription process.
 *
 * This function initializes file paths, transcribes audio from the given file path,
 * extracts text from the transcription, and writes the extracted text to an output file.
 *
 * @async
 * @function main
 * @returns {Promise<void>} A promise that resolves when the process is complete.
 * @throws Will log an error message if any step in the process fails.
 */
const main = async () => {
  const { audioFilePathAbs, outputFilePathAbs } = initPaths();

  try {
    const transcript = await transcribeAudio(audioFilePathAbs);
    const extractedText = extractText(transcript);
    writeToFile(outputFilePathAbs, extractedText);
  } catch (error) {
    console.error("[Main] Error:", error);
  }
};

main();
