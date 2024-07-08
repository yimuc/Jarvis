import fs from 'fs';
import chalk from 'chalk';

const {
  LANGUAGE = 'cn',
  SPEECH_MODEL_PATH = '',
  SPEAKER_MODEL_PATH = '',
  AI_BASE_URL,
  AI_MODEL,
  AI_API_KEY,
  PLUGIN_TODO_LIST,
  CONVERSATION_INACTIVITY_LIMIT = '2',
  CONVERSATION_HISTORY_LIMIT = '10',
  SPEAK_SPEED = '1.1',
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

if (!LANGUAGE) {
  printError(genEnvErrMsg('LANGUAGE'));
}

if (!/^\d{1,3}$/.test(CONVERSATION_INACTIVITY_LIMIT) || +CONVERSATION_INACTIVITY_LIMIT < 1) {
  printError(genEnvErrMsg('CONVERSATION_INACTIVITY_LIMIT', CONVERSATION_INACTIVITY_LIMIT));
}

if (!/^\d{1,3}$/.test(CONVERSATION_HISTORY_LIMIT) || +CONVERSATION_HISTORY_LIMIT < 1) {
  printError(genEnvErrMsg('CONVERSATION_HISTORY_LIMIT', CONVERSATION_HISTORY_LIMIT));
}

if (!/^[0-9](\.\d)?$/.test(SPEAK_SPEED)) {
  printError(genEnvErrMsg('SPEAK_SPEED', SPEAK_SPEED));
}

export default {
  I18N: (await import(`./i18n/${LANGUAGE}.json`, { assert: { type: "json" } })).default,
  speechModelPath: VOSK_MODEL_DIR + SPEECH_MODEL_PATH,
  speakerModelPath: useSpeakerModel ? VOSK_MODEL_DIR + SPEAKER_MODEL_PATH : undefined,
  model: AI_MODEL,
  baseURL: AI_BASE_URL,
  apiKey: AI_API_KEY,
  conversationInactivityLimit: +CONVERSATION_INACTIVITY_LIMIT * 60 * 1000,
  conversationHistoryLimit: +CONVERSATION_HISTORY_LIMIT * 2,
  speakSpeed: +SPEAK_SPEED,
  enablePluginTodoList: !!PLUGIN_TODO_LIST,
};
