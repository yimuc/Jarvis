import { Readable } from "stream";
import recorder from 'node-record-lpcm16';
import vosk from 'vosk';
import wav from "wav";
import say from 'say';
import chalk from 'chalk';
import AI from './ai.js';
import env from './env.js';

const {
  speechModelPath,
  speakerModelPath,
  hotWordWakeUp,
  conversationInactivityLimit
} = env;

const ai = new AI;

vosk.setLogLevel(0);
const model = new vosk.Model(speechModelPath);
const speakerModel = speakerModelPath ? new vosk.SpeakerModel(speakerModelPath) : undefined;

const wfReader = new wav.Reader();
const wfReadable = new Readable().wrap(wfReader);

const recording = recorder.record({
  sampleRate: 44100,
});

let lastConversationTimestamp = 0;

wfReader.on('format', async ({ audioFormat, sampleRate, channels }) => {
  if (audioFormat != 1 || channels != 1) {
    console.error(chalk.red("Audio file must be WAV format mono PCM."));
    process.exit(1);
  }

  const rec = new vosk.Recognizer({ model, sampleRate, });
  if (speakerModel) {
    rec.setSpkModel(speakerModel);
  }
  rec.setMaxAlternatives(10);
  rec.setWords(true);
  rec.setPartialWords(true);

  for await (const data of wfReadable) {
    const endOfSpeech = rec.acceptWaveform(data);
    if (endOfSpeech) {
      // console.log('End of speech: true.', JSON.stringify(rec.result(), null, 4));
      const result = rec.result();
      const speakText = result?.alternatives?.[0]?.text || '';

      if (!speakText.length) continue;

      const now = +new Date;
      const isOldConversation = now - lastConversationTimestamp < conversationInactivityLimit;

      if (isOldConversation || speakText.startsWith(hotWordWakeUp)) {
        lastConversationTimestamp = now;

        if (!isOldConversation) {
          ai.clearHistory();
        }

        console.log(chalk.bold.green('     I:'), speakText);
        recording.pause();

        const message = await ai.simpleChat(speakText);
        console.log(chalk.bold.blue('Jarvis:'), message);

        say.speak(message, undefined, 1, err => {
          if (err) {
            console.error(chalk.red('Jarvis speak error.'), err);
          }
          console.log(chalk.grey('Jarvis speak end.'));
          recording.resume();
        });
      }
    } else {
      // console.log('End of speech: false.', JSON.stringify(rec.partialResult(), null, 4));
    }
  }

  console.log(chalk.grey('Final result.'), JSON.stringify(rec.finalResult(rec), null, 4));
  rec.free();
});

recording
  .stream()
  .pipe(wfReader)
  .on('finish', (err) => {
    if (err) {
      console.error(chalk.red('Finish error.'), err);
    }
    model.free();
    speakerModel?.free();
  });
