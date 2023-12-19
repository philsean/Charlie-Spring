const puzzles = [
  [ '<:hda1:1185230990608711730>', '<:hda2:1185231279722074223>', '<:hda3:1185231355538325555>', '<:hda4:1185231400295727254>'
    '<:hda5:1185231459045351534>', '<:hda6:1185231495732932688>', '<:hda7:1185231535872409621>', '<:hda8:1185231585503625296>'],
  [ '', '', '', ''
    '', '', '', ''],
  [ '', '', '', ''
    '', '', '', ''],
  [ '', '', '', ''
    '', '', '', '']
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