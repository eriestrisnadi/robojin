var irc     = require('irc')
  , http    = require('http')
  , irc     = require('irc')
  , fs      = require('fs')
  , mkdirp  = require('mkdirp')
  , _       = require('underscore')
  , path    = require('path')
  , appRoot = path.resolve(__dirname)
  , argv    = require('yargs').argv;
const chalk = require('chalk');
var config = JSON.parse(fs.readFileSync('./.robojin.json'));
var quotes = [];
var topics = {};

_.each(fs.readdirSync('./data/quotes'), function (file) {
  if (file.substr(-5) === '.json') {
    var chunk = JSON.parse(fs.readFileSync('./data/quotes/' + file));
    topics[chunk.topic] = chunk.quotes;
    quotes = quotes.concat(chunk.quotes);
  }
});

var port, server, channel, nick, format, formats;

formats = ['json', 'jsonl', 'csv', 'md', 'markdown'];

(argv.port) ? port = argv.port : port = 6667;
(argv.server) ? server = argv.server.toLowerCase() : server = config.server;
(argv.channel) ? channel = argv.channel.toLowerCase() : channel = config.channel;
(argv.nick) ? nick = argv.nick.toLowerCase() : nick = config.botname;
(argv.verbose) ? verbose = true : verbose = false;

if (argv.format) {
  if (formats.indexOf(argv.format) === -1) {
    return console.log( chalk.red('ERROR') +  ' invalid format' );
  }

  format = argv.format.toLowerCase();
  if (format === 'markdown') format = 'md';

} else {
  format = config.format;
}

var client = new irc.Client(server, nick, {
  autoRejoin: true,
  autoConnect: false,
  port: port,
  userName: nick,
  secure: false,
  encoding: 'UTF-8'
});

client.connect(5, function(input) {
  console.log( chalk.green('Established connection to ' + server) );

  client.join(channel, function(input) {
    console.log( chalk.green('Asking permission to join ' + channel) );
  });
});

var explaining = false;

client.addListener('message', function(from, to, message) {
  message = message.toLowerCase();
  if (!explaining && _.include(['::knowledgeable', '::' + nick], message)) {
    explaining = true;
    client.say(from, 'I am knowledgeable in the following areas: ');
    var gr = _.values(_.groupBy(_.keys(topics), function (topic) {
      return topic.substr(0, 1);
    }));

    var explain = function() {
      if(gr.length > 0){
        client.say(from, gr.shift().join(', '));
        setTimeout(explain, 1300);
      }else{
        explaining = false;
      }
    };

    explain();

  }else if(message.indexOf(nick) !== -1){
    var topicless = true;
    _.each(topics, function (quotes, topic) {
      if (message.indexOf(topic) !== -1) {
        var quote = quotes[Math.floor(Math.random() * quotes.length)];
        client.say(to, quote.author + ' once said "' + quote.quote + '"');
        topicless = false;
      }
    });
    if(topicless){
      var quote = quotes[Math.floor(Math.random() * quotes.length)];
      client.say(to, 'Not sure if this is relevant, but ' + quote.author + ' once said "' + quote.quote + '"');
    }
  } else if(/^::join #[a-zA-Z0-9]/i.test(message)){
    var chan = message.split(" ")[1];
    client.join(chan, function(input) {
      console.log( chalk.green('Joined ' + chan) );
    });
  }
});

// Logs
mkdirp('logs', function (err) {
  if(err) {
    return console.log( chalk.red(err) );
  }
});

var log = {};
log.server = server;
log.channel = channel;
log.events = [];

client.addListener('message', function (from, to, text) {
  const date = new Date();

  var epochTimeStamp = Math.floor(date / 1000);
  var isoTimeStamp = date.toISOString();

  var path = "logs/" + to + "-" + isoTimeStamp.slice(0,10) + "." + format

  var obj = { nick: from, message: text, time: epochTimeStamp };
  var update =  chalk.yellow('[' + isoTimeStamp.slice(11,19) + ']') + ' ' + path + ' has been updated';

  if (format === 'json') {
    log.events.push(obj);
    var contents = JSON.stringify(log) + '\n'

    fs.writeFile(path, contents, function(err) {
      if(err) {
        return console.log( chalk.red(err) );
      }
      if (verbose) console.log(update);
    });

  } else if (format === 'jsonl') {
    var contents = JSON.stringify(obj) + '\n'

    fs.appendFile(path, contents, function(err) {
      if(err) {
        return console.log( chalk.red(err) );
      }
      if (verbose) console.log(update);
    });

  } else if (format === 'csv') {
    var header = ['nick', 'message', 'time'];
    var contents = [JSON.stringify(from), JSON.stringify(text), epochTimeStamp];

    fs.stat(path, function(err, stat) {

      if(err == null) {
        fs.appendFile(path, contents.join() + '\n', function(err) {
          if(err) {
            return console.log( chalk.red(err) );
          }
          if (verbose) console.log(update);
        });
      } else if(err.code == 'ENOENT') {
        fs.writeFile(path, header.join() + '\n' + contents.join() + '\n');
        console.log(update);
      } else {
        return console.log( chalk.red(err) );
      }
    });

  } else if (format === 'md') {
    var contents = '[' + isoTimeStamp.slice(11,19) + ']  ' + '**' + from + '** ' + text + '<br />'
    fs.appendFile(path, contents, function(err) {
      if(err) {
        return console.log( chalk.red(err) );
      }
      if (verbose) console.log(update);
    });

  };

});
