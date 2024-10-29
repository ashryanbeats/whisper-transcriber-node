import fs from "fs";
import path from "path";
import { transcribeAudio } from "./whisperHandler.js";

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

const writeToFile = (outputFilePath, text) => {
  fs.writeFileSync(outputFilePath, JSON.stringify(text), "utf8");
  console.log("[Main] Transcription saved to:", outputFilePath);
};

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
