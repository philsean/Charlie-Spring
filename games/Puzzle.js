const puzzles = [
  [ '', '', ''
    '', '', ''],
  [ '', '', ''
    '', '', ''],
  [ '', '', ''
    '', '', '']
];

module.exports = class Puzzle {
  constructor ({ client, message }) {
    this.client = client;
    this.message = message;
    this.image = ([0, 1, 2, 3].sort(() => 0.5 - Math.random()))[0];
    this.puzzle = puzzles[image].sort(() => 0.5 - Math.random());
    this.moves = [];
    
  }
}