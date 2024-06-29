# Jarvis

Jarvis is a voice assistant based on Node.js. It records audio through the device, analyzes preset wake words to activate AI capabilities, obtains the reply content through the AI interface, and finally plays the reply content through the device's audio.

Jarvis 是一个基于 node.js 的语音助手，它通过设备录音，分析预置的热词唤醒 AI 能力，通过 AI 接口得到回复内容，最终以设备音频方式播放回复的内容。

简体中文用户，如果你已经安装好了`sox`，并且已经执行了`pnpm install`，请直接阅读：[快速启动](./README_CN.md)

## Working

```
  Device recording -> SoX(Speech-to-text) -> AI chat api -> Text-to-speech on the device -> Play audio
  Local            -> Local               -> Remote      -> Local                        -> Local
```

## Dependencies

Renaming the `.env.example` file to `.env` and editing the configuration settings within it should be the first step.

After that, running `pnpm install` should suffice.

This module requires you to install [SoX](http://sox.sourceforge.net/) and it must be available in your `$PATH`.

### For Mac OS

1. [Install Homebrew](https://brew.sh/)
2. `brew install sox`

### For most linux disto's

`sudo apt-get install sox libsox-fmt-all`

### For Windows

Working version for Windows is 14.4.1. You can [download the binaries](https://sourceforge.net/projects/sox/files/sox/14.4.1/) or use [chocolately](https://chocolatey.org/install) to install the package

`choco install sox.portable`

## Check your .env file

`npm run check-env`
