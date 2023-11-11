// Função para gerar um número inteiro aleatório entre min e max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Função para criar um grafo de n x m vértices, onde cada vértice tem quatro vizinhos (cima, baixo, esquerda, direita)
// Cada aresta tem um peso aleatório entre 1 e 10
function createGraph(n, m) {
  let graph = [];
  let index = 0;
  // Criar os vértices do grafo
  for (let i = 0; i < n; i++) {
    graph[i] = [];
    for (let j = 0; j < m; j++) {
      graph[i][j] = { index: index++, x: i, y: j };
    }
  }
  // Criar as arestas do grafo
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      let v = graph[i][j];
      v.edges = [];
      // Adicionar a aresta para o vértice acima, se existir
      if (i > 0) {
        v.edges.push({ u: v, v: graph[i - 1][j], w: randomInt(1, 10) });
      }
      // Adicionar a aresta para o vértice abaixo, se existir
      if (i < n - 1) {
        v.edges.push({ u: v, v: graph[i + 1][j], w: randomInt(1, 10) });
      }
      // Adicionar a aresta para o vértice à esquerda, se existir
      if (j > 0) {
        v.edges.push({ u: v, v: graph[i][j - 1], w: randomInt(1, 10) });
      }
      // Adicionar a aresta para o vértice à direita, se existir
      if (j < m - 1) {
        v.edges.push({ u: v, v: graph[i][j + 1], w: randomInt(1, 10) });
      }
    }
  }
  return graph;
}

// Função para encontrar uma árvore geradora mínima usando o algoritmo de Prim
// Retorna um conjunto de arestas que formam a árvore
function prim(graph) {
  let n = graph.length;
  let m = graph[0].length;
  let tree = new Set(); // Conjunto de arestas da árvore
  let visited = new Set(); // Conjunto de vértices visitados
  let queue = []; // Fila de prioridade das arestas candidatas
  // Escolher um vértice inicial arbitrário
  let start = graph[0][0];
  // Adicionar as arestas desse vértice à fila
  for (let edge of start.edges) {
    queue.push(edge);
  }
  // Marcar o vértice como visitado
  visited.add(start);
  // Enquanto a fila não estiver vazia e a árvore não tiver todas as arestas possíveis
  while (queue.length > 0 && tree.size < n * m - 1) {
    // Remover a aresta de menor peso da fila
    let minEdge = queue.shift();
    // Se o vértice destino da aresta não foi visitado ainda
    if (!visited.has(minEdge.v)) {
      // Adicionar a aresta à árvore
      tree.add(minEdge);
      // Adicionar as arestas do vértice destino à fila
      for (let edge of minEdge.v.edges) {
        queue.push(edge);
      }
      // Marcar o vértice destino como visitado
      visited.add(minEdge.v);
    }
    // Ordenar a fila por peso das arestas
    queue.sort((a, b) => a.w - b.w);
  }
  return tree;
}

// Função para gerar um mapa de labirinto a partir de uma árvore geradora mínima
// Retorna uma matriz bidimensional que representa o labirinto, onde 0 significa parede e 1 significa caminho
function createMaze(tree, n, m) {
  let maze = [];
  // Inicializar a matriz com zeros
  for (let i = 0; i < 2 * n + 1; i++) {
    maze[i] = [];
    for (let j = 0; j < 2 * m + 1; j++) {
      maze[i][j] = 0;
    }
  }
  // Percorrer as arestas da árvore
  for (let edge of tree) {
    // Obter as coordenadas dos vértices da aresta
    let x1 = edge.u.x;
    let y1 = edge.u.y;
    let x2 = edge.v.x;
    let y2 = edge.v.y;
    // Marcar as células correspondentes na matriz como caminho
    maze[2 * x1 + 1][2 * y1 + 1] = 1;
    maze[2 * x2 + 1][2 * y2 + 1] = 1;
    maze[x1 + x2 + 1][y1 + y2 + 1] = 1;
  }
  return maze;
}

function createWay (mazer, row, bottom) {
  let flip = [false, true, true].sort(() => 0.5 - Math.random())[0];
  if (flip) mazer[row].reverse();
  let way = false;
  let put = bottom ? row + 1 : row - 1;
  mazer[row].map((x, i) => {
    const _v = () => {
      if (!way && mazer[row][i] === 1 && mazer[row][i - 1] === 0 && mazer[row][i + 1] === 0) {
        mazer[put][i] = 1;
        way = true;
      };
    };
    
    const _hl = () => {
      if (!way && mazer[row][i] === 1 && mazer[row][i - 1] === 1 && mazer[row][i + 1] === 0) {
        mazer[put][i] = 1;
        way = true;
      };
    };
    
    const _hr = () => {
      if (!way && mazer[row][i] === 1 && mazer[row][i - 1] === 0 && mazer[row][i + 1] === 1) {
        mazer[put][i] = 1;
        way = true;
      };
    };
    
    const walk = () => {
      [_v, _hl, _hr].shuffle()[0]();
      return { walk };
    }
    walk().walk();
    if (way && mazer[put][i] === 1 && bottom) mazer[put][i] = 2;
    if (way && mazer[put][i] === 1 && !bottom) mazer[put][i] = 3;
  });
  if (flip) mazer[row].reverse();
  return { createWay, maze: mazer };
}

function enlargeMaze (maze) {
  let position = maze.filter(x => x.indexOf(2) !== -1)[0];
  let pos = { x: position.indexOf(2), y: maze.indexOf(position) };
  return maze.slice(pos.y - 2 === -1 ? 0 : pos.y - 2, pos.y + 2).map(x => x.slice(pos.x - 2 === -1 ? 0 : pos.x - 2, pos.x + 2));
}

function printMaze(maze) {
  let output = "";
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      output += maze[i][j] === 0 ? "🟦" : (maze[i][j] === 2 ? "🔴" : (maze[i][j] === 3 ? "🏳️" : "⬛"));
    }
    output += "\n";
  }
  return output;
}

module.exports = { randomInt, createGraph, prim, createMaze, createWay, enlargeMaze, printMaze };
