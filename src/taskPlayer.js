import chalk from 'chalk';
import { speak } from "./utils/index.js";

class TaskPlayer {
   /** @type {{message: string; timestamp: number; cb?: () => void;}[]} */
   #messages = [];

   /** @param {{speakStart?: () => void; speakEnd?: () => void}} [options={}] */
   constructor(options = {}) {
      this.speakStart = options.speakStart;
      this.speakEnd = options.speakEnd;

      this.#loop();
   }

   #loop() {
      setTimeout(async () => {
         const now = +new Date;
         const first = this.#messages[0];

         if (first && first.timestamp <= now) {
            this.speakStart?.();
            try {
               console.log(chalk.bold.yellow('Jarvis:'), first.message);
               await speak(first.message);
               first.cb?.();
               // NOTE: Cannot use this.#messages.shift();
               this.#messages = this.#messages.filter(it => it !== first);
               console.log(chalk.grey('Jarvis speak end.'));
            } catch (err) {
               console.error(chalk.red('Jarvis speak error.'), err);
            } finally {
               this.speakEnd?.();
            }
         }

         this.#loop();
      }, 1000);
   }

   add(message, timestamp = 0, cb) {
      let index = 0;
      for (let i = 0; i < this.#messages.length; i++) {
         if (timestamp < this.#messages[i].timestamp) {
            break;
         }
         index++;
      }
      this.#messages.splice(index, 0, { message, timestamp, cb });
   }
}

export default TaskPlayer;
