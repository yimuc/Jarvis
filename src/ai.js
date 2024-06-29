import OpenAI from "openai";
import chalk from 'chalk';
import env from './env.js';

const {
   model,
   baseURL,
   apiKey,
   systemMessage,
   errorVoiceContent,
   conversationHistoryLimit,
} = env;

export default class AI {
   history = [];

   constructor() {
      this.client = new OpenAI({
         apiKey,
         baseURL,
      });
   }

   pushHistory(struct) {
      if (this.history.length > conversationHistoryLimit) {
         this.history = this.history.slice(-conversationHistoryLimit);
      }
      this.history.push(struct);
   }

   clearHistory() {
      this.history = [];
   }

   get systemMessage() {
      return {
         role: "system",
         content: systemMessage,
      };
   }

   async simpleChat(message) {
      this.pushHistory({ role: "user", content: message });

      try {
         const completion = await this.client.chat.completions.create({
            model,
            messages: [
               this.systemMessage,
               ...this.history,
            ],
            n: 1,
            temperature: 0.3
         });
         const replyMessage = completion.choices[0].message;
         this.pushHistory(replyMessage);
         return replyMessage.content;
      } catch (err) {
         console.error(chalk.red('AI chat error.'), err);
         this.pushHistory({ role: 'assistant', content: '' });
         return errorVoiceContent;
      }
   }
}
