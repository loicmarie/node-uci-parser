# UCI parser for Node.js
Parser for UCI protocol written in node.js, to help to easily create UCI modules.

## Installation
```bash
npm install --save uci-parser
```

## Usage example
```js
const UCIParser = require('uci-parser');

let uci = new UCIParser();

uci.on('uci', opts => {
  console.log('<< uci', opts);
  console.log('>> uciok');
});

uci.on('debug', opts => {
  console.log('<< debug', opts);
});

uci.on('setoption', opts => {
  console.log('<< setoption', opts);
});

uci.on('register', opts => {
  console.log('<< register', opts);
});

uci.on('ucinewgame', opts => {
  console.log('<< ucinewgame', opts);
});

uci.on('isready', opts => {
  console.log('<< isready', opts);
  console.log('>> readyok');
});

uci.on('position', opts => {
  console.log('<< position', opts);
});

uci.on('go', opts => {
  console.log('<< go', opts);
  console.log('>> bestmove e2e4');
});

uci.on('stop', opts => {
  console.log('<< stop', opts);
  console.log('>> bestmove d2d4');
});

uci.on('ponderhit', opts => {
  console.log('<< ponderhit', opts);
});

uci.on('quit', opts => {
  console.log('<< quit', opts);
  process.exit(0);
});

uci.listen();
```

## Run

You can now try the different commands in the prompt with: `node indes.js`

```
uci
<< uci {}
>> uciok
debug on
<< debug { debug: true }
setoption name Nullmove value true
<< setoption { Nullmove: 'true' }
setoption name Style value Very risky
<< setoption { Style: 'Very risky' }
register name
<< register { token: 'name' }
ucinewgame
<< ucinewgame {}
isready
<< isready {}
>> readyok
position startpos moves e2e4 e7e5
<< position { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  moves: [ 'e2e4', 'e7e5' ] }
go infinite binc 12 winc 24 nodes 200 searchmoves e2e4 d2d4 g1f3 ponder
<< go { ponder: true,
  infinite: true,
  binc: 12,
  winc: 24,
  nodes: 200,
  searchmoves: [ 'e2e4', 'd2d4', 'g1f3' ] }
>> bestmove e2e4
stop
<< stop {}
>> bestmove d2d4
ponderhit
<< ponderhit {}
quit
<< quit {}
```

## Create binary
I recommand to user [nexe](https://github.com/nexe/nexe) to create binary UCI module.
