[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Travis](https://img.shields.io/travis/lowsprofile/robojin.svg?style=flat-square)](https://travis-ci.org/lowsprofile/robojin)
[![npm](https://img.shields.io/badge/npm-v0.0.1-orange.svg?style=flat-square)](https://www.npmjs.com/package/~lowsprofile/robojin)
[![Dependency Status](https://david-dm.org/lowsprofile/robojin.svg?style=flat-square)](https://david-dm.org/lowsprofile/robojin#info=Dependencies)
# robojin
Just an irc bot that can interacting with users

### Installation
###### Clone
```bash
git clone https://github.com/lowsprofile/robojin.git
```
Or, you can download from the latest release [here]()
###### Install Dependencies
```bash
npm install
```

### Cofiguration file & Start robojin
Change the config variable on the `.robojin.json`.
###### Default configuration `.robojin.json`
```bash
{
  "server": "irc.rizon.net",
  "port": 6697,
  "botname": "robojin",
  "channel": "#sorairo-subs",
  "format": "json"
}
```
###### Start robojin via npm, run:
```bash
npm start
```

### Interacting with robojin
In any channel, just mention it's name first and start with the topic you want to talk.
```bash
[15:26]	sundajin:	robojin, what is justice in your mind?
[15:26]	@robojin:	Epicurus once said "It is the spirit and not the form of law that keeps justice alive."
```
The current robojin is not smart enough, so if he cannot find a topic you mention it, robojin will come up with something useful anyway.

### Log files
There are 4 log formats, change the format value on the configuration file `.robojin.json`.
###### JSON
```bash
"format": "json"
```
###### JSON Lines
```bash
"format": "jsonl"
```
###### CSV
```bash
"format": "csv"
```
###### Markdown
```bash
"format": "markdown"
```
Or
```bash
"format": "md"
```
