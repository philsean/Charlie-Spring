const Maze = require('../../../games/MazeGame');

module.exports = {
  structure: {
    name: 'maze',
    description: 'Descubra qual o caminho você deve seguir para escapar do Labirinto.',
    aliases: ['labirinto', 'labyrinth']
  },
  run: async (client, message, args) => {
    let game = new Maze(client, message, 5);
    client.games.maze.set(message.id, game);
    client.games.maze.get(message.id).start();
  }
}