# Whisper Transcriber Node.js

This repository contains a project for transcribing audio with Whisper and Node.js.

## Setup

1. Clone the repository:

```sh
git clone <repo>
cd whisper-transcriber-node
```

2. Install dependencies:

```sh
npm install
```

## Usage

Note: Your audio file must in the .wav format at a sample rate of 16000 Hz. If your audio file is in a different format, you can convert it using ffmpeg:

```sh
ffmpeg -i input.mp3 -ar 16000 output.wav
```

To run:

```sh
npm start /absolute/path/to/audio/file.wav
```
