import env from '../../env.js';
import { isString } from '../../utils/is.js';

const { I18N } = env;

export default class Plugin {
   struct = {
      name: I18N.PLUGINS.NORMAL.NAME,
      desc: I18N.PLUGINS.NORMAL.DESCRIPTION,
      response: I18N.PLUGINS.NORMAL.RESPONSE
   };

   constructor(taskPlayer) {
      this.taskPlayer = taskPlayer;
   }

   validate(response) {
      return isString(response);
   }

   emit(response) {
      this.taskPlayer.add(response);
   }
}
