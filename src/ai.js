import OpenAI from "openai";
import chalk from 'chalk';
import { getReplyError } from './utils/index.js';
import env from './env.js';

const {
   I18N,
   model,
   baseURL,
   apiKey,
   conversationHistoryLimit,
} = env;

export default class AI {
   #client = new OpenAI({
      apiKey,
      baseURL,
   });
   #history = [];
   #promptSuffix;

   constructor(promptSuffix) {
      this.#promptSuffix = promptSuffix;
      console.log(
         chalk.bgGray('\nAI chat system message:\n'),
         this.#systemMessage.content
      );
   }

   get #systemMessage() {
      return {
         role: "system",
         content: [
            I18N.AI_SYSTEM_MESSAGE,
            I18N.AI_SYSTEM_MESSAGE_DATETIME + new Date().toLocaleString(),
            this.#promptSuffix,
         ].join('\n'),
      };
   }

   #pushHistory(struct) {
      if (this.#history.length > conversationHistoryLimit) {
         this.#history = this.#history.slice(-conversationHistoryLimit);
      }
      this.#history.push(struct);
   }

   clearHistory() {
      this.#history = [];
   }

   async simpleChat(message) {
      this.#pushHistory({ role: "user", content: message });

      try {
         const completion = await this.#client.chat.completions.create({
            model,
            messages: [
               this.#systemMessage,
               ...this.#history,
            ],
            n: 1,
            temperature: 0.3,
            response_format: {
               type: "json_object",
            },
         });
         const replyMessage = completion.choices[0].message;

         this.#pushHistory(replyMessage);

         const replyJson = JSON.parse(replyMessage.content);
         if (!replyJson.id || !replyJson.response) {
            throw new Error(replyJson);
         }
         return replyJson;
      } catch (err) {
         this.#pushHistory({ role: 'assistant', content: '' });
         return getReplyError(err);
      }
   }
}
