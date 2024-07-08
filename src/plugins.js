import chalk from 'chalk';
import { getReplyError } from './utils/index.js';
import env from './env.js';

const { I18N, enablePluginTodoList } = env;

export default class Plugins {
   /** @type {{id: string; instance: {}}[]} */
   #plugins = [];

   constructor(taskPlayer) {
      this.taskPlayer = taskPlayer;
   }

   async init() {
      const pluginIds = ['normal'];

      if (enablePluginTodoList) {
         pluginIds.push('todo-list');
      }

      // Other plugins...

      const pluginInstances = await Promise.all(
         pluginIds.map(async id => {
            const Plugin = (await import(`./plugins/${id}/index.js`)).default;
            return new Plugin(this.taskPlayer);
         })
      );

      for (let index = 0; index < pluginIds.length; index++) {
         this.#registry(pluginIds[index], pluginInstances[index]);
      }
   }

   #registry(id, instance) {
      this.#plugins.push({ id, instance });
   }

   get prompts() {
      return [
         I18N.AI_COMMAND_TIPS,
         ...this.#plugins.map(
            ({ id, instance }, index) => this.#genPrompt(id, instance, index)
         ),
      ].join('\n');
   }

   #genPrompt(id, instance, index) {
      const { name, desc, response } = instance.struct;
      return `${index + 1}. ${name}${desc}\t${I18N.AI_EXPECTED_OUTCOME}${JSON.stringify({
         id,
         response,
      })}`;
   }

   emit(id, response) {
      const plugin = this.#plugins.find(plugin => plugin.id === id);
      if (plugin && plugin.instance.validate(response)) {
         console.log(chalk.blue('Plugin:'), id);
         plugin.instance.emit(response);
      } else {
         const { instance: normalInstance } = this.#plugins.find(plugin => plugin.id === 'normal');
         normalInstance.emit(getReplyError(response).response);
      }
   }
}
