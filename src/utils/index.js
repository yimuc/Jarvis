import say from 'say';
import chalk from 'chalk';
import env from '../env.js';

export * from './is.js';

const { I18N, speakSpeed } = env;

/** Promisify speak */
export function speak(message) {
   return new Promise((resolve, reject) => {
      say.speak(message, undefined, speakSpeed, err => {
         if (err) {
            reject(err);
         } else {
            resolve();
         }
      });
   });
}

/** Use a consistent error response content */
export function getReplyError(err) {
   console.error(chalk.red('AI chat error.'), err);

   return {
      id: 'normal',
      response: I18N.AI_ERROR_VOICE_CONTENT,
   };
}
