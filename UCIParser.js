const readline = require('readline');

const STARTPOS = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

class UCIController {

  constructor() {
    this.callbacks = {};
  }

  on(cmd, callback) {
    this.callbacks[cmd] = callback;
  }

  listen() {
    rl.on('line', line => {
      let args = line.split(' ');
      let cmd = args.shift();
      if (this.callbacks.hasOwnProperty(cmd))
        this.parseArguments(cmd, args);
    });
  }

  parseArguments(cmd, args) {
    switch(cmd) {
      case 'uci': this.handleCmdUCI(args); break;
      case 'debug': this.handleCmdDebug(args); break;
      case 'setoption': this.handleCmdSetOption(args); break;
      case 'register': this.handleCmdRegister(args); break;
      case 'ucinewgame': this.handleCmdUCINewGame(args); break;
      case 'isready': this.handleCmdIsReady(args); break;
      case 'position': this.handleCmdPosition(args); break;
      case 'go': this.handleCmdGo(args); break;
      case 'stop': this.handleCmdStop(args); break;
      case 'ponderhit': this.handleCmdPonderHit(args); break;
      case 'quit': this.handleCmdQuit(args); break;
    }
  }

  handleCmdUCI(args) {
    this.callbacks['uci']({});
  }

  handleCmdDebug(args) {
    let opts = {debug: false};
    if (args.length > 0 && args[0] == 'on')
      opts.debug = true;
    this.callbacks['debug'](opts);
  }

  handleCmdSetOption(args) {
    let opts = {};
    let currName = '';
    let waitForName = true;
    let waitForValue = false;
    for (let arg of args) {
      if (arg == 'name') {
        waitForName = true;
        waitForValue = false;
        currName = '';
      } else if (arg == 'value') {
        waitForName = false;
        waitForValue = true;
        opts[currName] = '';
      } else if (waitForName) {
        currName += (currName == '' ? '' : ' ') + arg;
      } else if (waitForValue) {
        opts[currName] += (opts[currName] == '' ? '' : ' ') + arg;
      }
    }
    this.callbacks['setoption'](opts);
  }

  handleCmdRegister(args) {
    let opts = {token: 'later'};
    if (args.length > 0)
      opts.token = args[0];
    this.callbacks['register'](opts);
  }

  handleCmdUCINewGame(args) {
    this.callbacks['ucinewgame']({});
  }

  handleCmdIsReady(args) {
    this.callbacks['isready']({});
  }

  handleCmdPosition(args) {
    let opts = {'fen': null, 'moves': []};
    if (args[0] == 'startpos') {
      opts.fen = STARTPOS;
      if (args.length > 1 && args[1] == 'moves')
        for (let i = 2; i < args.length; i++)
          opts.moves.push(args[i]);
    } else
      opts.fen = args[0];
    this.callbacks['position'](opts);
  }

  handleCmdGo(args) {
    let opts = {ponder: false, infinite: false};
    let boolOpts = ['ponder', 'infinite'];
    let valOpts = ['wtime', 'btime', 'winc', 'binc', 'movestogo', 'depth', 'nodes', 'mate', 'movetime'];
    let waitForMoves = false;
    let waitForValue = false;
    let currName = '';
    for (let arg of args) {
      if (arg == 'searchmoves') {
        waitForMoves = true;
        waitForValue = false;
        opts['searchmoves'] = [];
      } else if (boolOpts.indexOf(arg) != -1) {
        opts[arg] = true;
        waitForMoves = false;
        waitForValue = false;
      } else if (valOpts.indexOf(arg) != -1) {
        currName = arg;
        waitForMoves = false;
        waitForValue = true;
      } else if (waitForMoves) {
        opts['searchmoves'].push(arg);
      } else if (waitForValue) {
        opts[currName] = parseInt(arg);
        currName = '';
        waitForValue = false;
      }
    }
    this.callbacks['go'](opts);
  }

  handleCmdStop(args) {
    this.callbacks['stop']({});
  }

  handleCmdPonderHit(args) {
    this.callbacks['ponderhit']({});
  }

  handleCmdQuit(args) {
    this.callbacks['quit']({});
  }

}

module.exports = UCIController;
