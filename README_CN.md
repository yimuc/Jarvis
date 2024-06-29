# 中文快速启动文档

## 启动配置

### 1. `.env` 文件

把项目根目录的`.env.example`文件复制一份，重命名为`.env`文件。

### 2. 下载中文语音识别模型

去[这里](https://alphacephei.com/vosk/models)下载中文模型，下载"vosk-model-small-cn-0.22"就行，
下载完成后解压，把目录移动到本项目`vosk-model`目录下，此时目录结构大概如下：

```
Jarvis/
|-- vosk-model/
|--|-- README.md
|  |-- vosk-model-small-cn-0.22/
```

"vosk-model-small-cn-0.22"目录名你也可以改成别的名字，只要跟`.env`文件中的`SPEECH_MODEL_PATH`配置项的值一样。

![模型选择](https://github.com/yimuc/Jarvis/blob/master/example/model-chinese.png?raw=true)

### 3. 拿到 AI API Key

开发调试时使用的国内`Moonshot`平台提供的 AI 接口，但实际不限制，
只要符合 OpenAI 接口规范的 AI 都可以使用。

仅测试使用可以去[Moonshot](https://platform.moonshot.cn)注册账号，新用户会赠送一部分用量。
注册完成后，就可以生成 AI API Key 了，如图：

![AI API Key](https://github.com/yimuc/Jarvis/blob/master/example/moonshot-api-key.png?raw=true)

然后把 Key 填入`.env`文件中的`AI_API_KEY`的值。

## 检查配置文件

使用`npm run check-env`自动检查`.env`文件配置是否有效。

## FAQ

### 不同 AI 是否支持？

大部分 AI 平台都是支持的，只要符合 OpenAI Chat 接口规范（市场上的 AI 基本都是可以的）。

对应`.env`文件中的`AI_BASE_URL`、`AI_MODEL`、`AI_API_KEY`三个配置项。

### 唤醒？

`.env`文件中的`HOT_WORD_WAKE_UP`是唤醒词，比如“请”、“小助手”等。

注意：实际唤醒词是否生效，依赖固定语言的语音识别模型，以下 3 种情况可能无法唤醒 Jarvis：

- 不常用的词
- 过长的词
- 不同语音输入（比如下载了中文语音识别模型，唤醒词设置为英文）。

举例：假如设置为“请”，只有你说的第一个字是“请”，才能唤醒 Jarvis。
当你唤醒 Jarvis，在最后一次对话后，`.env`文件中`CONVERSATION_INACTIVITY_LIMIT`配置项的值表示的是分钟数，
在其到期后将自动关闭此次对话，下次需要重新用“请”开头的语音来开启新一轮对话。

### 对话上下文长度？

`.env`文件中的`CONVERSATION_HISTORY_LIMIT`配置项，是每次对话时发送给 AI 的历史对话条数，帮助 AI 理解对话上下文。不建议设置过大，会消费 AI token。
