import fs from 'fs';
import chalk from 'chalk';

const {
  SPEECH_MODEL_PATH = '',
  SPEAKER_MODEL_PATH = '',
  AI_BASE_URL,
  AI_MODEL,
  AI_API_KEY,
  HOT_WORD_WAKE_UP,
  AI_SYSTEM_MESSAGE,
  AI_ERROR_VOICE_CONTENT,
  CONVERSATION_INACTIVITY_LIMIT = '2',
  CONVERSATION_HISTORY_LIMIT = '10',
} = process.env;

function genEnvErrMsg(envKey, curr) {
  return `Please set the correct value for "${envKey}" in the .env file${curr ? `, it is currently set to ${curr}.` : '.'}`;
}

function printError(err) {
  console.error(chalk.red(err));
  process.exit(1);
}

const VOSK_MODEL_DIR = 'vosk-model/';

if (!SPEECH_MODEL_PATH) {
  printError(genEnvErrMsg('SPEECH_MODEL_PATH'));
}

if (!fs.existsSync(VOSK_MODEL_DIR + SPEECH_MODEL_PATH)) {
  printError(genEnvErrMsg(`Please download the model from https://alphacephei.com/vosk/models and unpack as ${SPEECH_MODEL_PATH} in the folder "/visk_model/".`));
}

let useSpeakerModel = false;
if (SPEAKER_MODEL_PATH) {
  useSpeakerModel = true;
  if (!fs.existsSync(VOSK_MODEL_DIR + SPEAKER_MODEL_PATH)) {
    printError(genEnvErrMsg(`Please download the model from https://alphacephei.com/vosk/models and unpack as ${SPEAKER_MODEL_PATH} in the folder "/visk_model/".`));
  }
}

if (!AI_BASE_URL) {
  printError(genEnvErrMsg('AI_BASE_URL'));
}

if (!AI_MODEL) {
  printError(genEnvErrMsg('AI_MODEL'));
}

if (!AI_API_KEY) {
  printError(genEnvErrMsg('AI_API_KEY'));
}

if (!HOT_WORD_WAKE_UP) {
  printError(genEnvErrMsg('HOT_WORD_WAKE_UP'));
}

if (!AI_SYSTEM_MESSAGE) {
  printError(genEnvErrMsg('AI_SYSTEM_MESSAGE'));
}

if (!AI_ERROR_VOICE_CONTENT) {
  printError(genEnvErrMsg('AI_ERROR_VOICE_CONTENT'));
}

if (!/^\d{1,3}$/.test(CONVERSATION_INACTIVITY_LIMIT) || +CONVERSATION_INACTIVITY_LIMIT < 1) {
  printError(genEnvErrMsg('CONVERSATION_INACTIVITY_LIMIT', CONVERSATION_INACTIVITY_LIMIT));
}

if (!/^\d{1,3}$/.test(CONVERSATION_HISTORY_LIMIT) || +CONVERSATION_HISTORY_LIMIT < 1) {
  printError(genEnvErrMsg('CONVERSATION_HISTORY_LIMIT', CONVERSATION_HISTORY_LIMIT));
}

export default {
  speechModelPath: VOSK_MODEL_DIR + SPEECH_MODEL_PATH,
  speakerModelPath: useSpeakerModel ? VOSK_MODEL_DIR + SPEAKER_MODEL_PATH : undefined,
  model: AI_MODEL,
  baseURL: AI_BASE_URL,
  apiKey: AI_API_KEY,
  hotWordWakeUp: HOT_WORD_WAKE_UP,
  systemMessage: AI_SYSTEM_MESSAGE,
  errorVoiceContent: AI_ERROR_VOICE_CONTENT,
  conversationInactivityLimit: +CONVERSATION_INACTIVITY_LIMIT * 60 * 1000,
  conversationHistoryLimit: +CONVERSATION_HISTORY_LIMIT * 2,
};
