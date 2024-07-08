import env from '../../env.js';
import { isDateTime, isString } from '../../utils/index.js';

const { I18N } = env;

export default class Plugin {
   struct = {
      name: I18N.PLUGINS.TODO_LIST.NAME,
      desc: I18N.PLUGINS.TODO_LIST.DESCRIPTION,
      response: {
         datetime: I18N.PLUGINS.TODO_LIST.RESPONSE_TIME,
         reminder: I18N.PLUGINS.TODO_LIST.RESPONSE_CONTENT,
         acknowledgement: I18N.PLUGINS.TODO_LIST.RESPONSE_ACKNOWLEDGEMENT,
      }
   };

   constructor(taskPlayer) {
      this.taskPlayer = taskPlayer;
   }

   validate(response) {
      return (
         isDateTime(response?.datetime) &&
         isString(response?.reminder) &&
         isString(response?.acknowledgement)
      );
   }

   emit(response) {
      this.taskPlayer.add(response.acknowledgement);
      this.taskPlayer.add(response.reminder, +new Date(response.datetime));
   }
}
