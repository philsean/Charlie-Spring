const { createGraph, prim, createMaze, createWay, enlargeMaze, printMaze } = require('./MazeUtils/maze.js');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const ex = new EmbedBuilder()
  .setColor(0x5865f2)
  .setTitle(`( 🏞️ ) › Labirinto | Game`);
  
module.exports = class MazeGame {
  constructor (client, message, size) {
    this.client = client;
    this.message = message;
    this.channel = message.channel;
    this.size = [(size ? (size[0] || 5) : 5), (size ? (size[1] || 5) : 5)];
      
    let graph = createGraph(this.size[0], this.size[1]);
    let tree = prim(graph);
    let maze = createMaze(tree, this.size[0], this.size[1]);
    
    this.maze = createWay(maze, 1).createWay(maze, this.size[0] * 2 - 1,true).maze;
    this.moves = [];
  }
  
  async start () {
    ex.setDescription(`**Movimentos:** \`0/35\`\n${printMaze(enlargeMaze(this.maze))}`);
    let left = new ButtonBuilder()
      .setCustomId('left')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('⬅️'),
        top = new ButtonBuilder()
      .setCustomId('top')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('⬆️'),
        bottom = new ButtonBuilder()
      .setCustomId('bottom')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('⬇️'),
        right = new ButtonBuilder()
      .setCustomId('right')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('➡️');
    this.getPosition = () => {
      let col = this.maze.filter(x => x.indexOf(2) !== -1)[0];
      return { x: col.indexOf(2), y: this.maze.indexOf(col) };
    };
    this.position = this.getPosition();
    this.verifyButtons = () => {
      if (this.maze[this.position.y][this.position.x - 1] === 0) left.setDisabled(true)
        else left.setDisabled(false);
      if (this.maze[this.position.y][this.position.x + 1] === 0) right.setDisabled(true)
        else right.setDisabled(false);
      if (!this.maze[this.position.y - 1] || this.maze[this.position.y - 1][this.position.x] === 0) top.setDisabled(true)
        else top.setDisabled(false);
      if (!this.maze[this.position.y + 1] || this.maze[this.position.y + 1][this.position.x] === 0) bottom.setDisabled(true)
        else bottom.setDisabled(false);
      return true;
    };
    
    this.verifyButtons();
    let row = new ActionRowBuilder().setComponents(left, top, bottom, right);
      
    let message = await this.channel.send({ embeds: [ex], components: [row] });
    const collector = message.createMessageComponentCollector({ filter: (i) => i.user.id === this.message.author.id, componentType: ComponentType.Button, time: 60000 * 5 });
    collector.on('collect', (i) => {
      this.moves.push(i.customId);
      this.position = this.getPosition();
      let nextPos = { x: this.position.x, y: this.position.y };
      if (i.customId === 'left') nextPos.x = this.position.x - 1
      else if (i.customId === 'top') nextPos.y = this.position.y - 1
      else if (i.customId === 'bottom') nextPos.y = this.position.y + 1
      else if (i.customId === 'right') nextPos.x = this.position.x + 1;
      
      this.maze[this.position.y][this.position.x] = this.position.y === (this.size[0] * 2) ? 0 : 1;
      this.maze[nextPos.y][nextPos.x] = 2;
      
      this.position = this.getPosition();
      this.verifyButtons();
       
      ex.setDescription(`**Movimentos:** \`${this.moves.length}/35\`\n${printMaze(enlargeMaze(this.maze))}`);
      let comp = [row];
      if (nextPos.y === 0) {
        comp = [];
        ex.setDescription(`**Movimentos:** \`${this.moves.length}/35\`\n${printMaze(this.maze)}`);
      };
      i.update({ embeds: [ex], components: comp });
    });
  }
}