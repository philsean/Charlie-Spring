let categories = {
  adjetivos: require('./AnagramWords/adjetivos.json').words,
  adverbios: require('./AnagramWords/adverbios.json').words,
  substantivos: require('./AnagramWords/substantivos.json').words,
  verbos: require('./AnagramWords/verbos.json').words
};

let special = {
  '0': ':zero:',
  '1': ':one:',
  '2': ':two:',
  '3': ':three:',
  '4': ':four:',
  '5': ':five:',
  '6': ':six:',
  '7': ':seven:',
  '8': ':eight:',
  '9': ':nine:',
  '#': ':hash:',
  '*': ':asterisk:',
  '?': ':grey_question:',
  '!': ':grey_exclamation:',
  ' ': ' ',
  'ç': ':regional_indicator_c:',
  'á': ':regional_indicator_a:',
  'é': ':regional_indicator_e:',
  'í': ':regional_indicator_i:',
  'ó': ':regional_indicator_o:',
  'ú': ':regional_indicator_u:',
  'â': ':regional_indicator_a:',
  'ê': ':regional_indicator_e:',
  'î': ':regional_indicator_i:',
  'ô': ':regional_indicator_o:',
  'û': ':regional_indicator_u:',
  'ã': ':regional_indicator_a:',
  'õ': ':regional_indicator_o:',
  '-': '-' 
}

module.exports = class Anagram {
  constructor (word, categorie, callback) {
    this.word = word || 'random';
    
    this.anagram = null;
    this.categorie = categorie || 'random';

    if (!categories[this.categorie]) this.categorie = 'random';
    if (this.categorie === 'random') this.categorie = Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)];
    if (this.word === 'random') {
      let words = categories[this.categorie];
      this.word = words[Math.floor(Math.random() * words.length)];
    } else {
      this.categorie = 'custom';
    }

    let anagrama = shuffleWord(this.word);
    let transform = anagrama.split('').map(str => special[str] ? /[a-z]/gi.test(str) ? `:regional_indicator_${special[str]}:` : special[str] : `:regional_indicator_${str}:`);

    this.anagram = { text: anagrama, emoji: transform }
  }

  play (answer) {
    let res = this;
    res.win = false;
    if (String(answer).includes(this.word)) {
      res.win = true
    }

    return res;
  }
}

function shuffleWord (word) {
  let arr = word.split('');
  arr.sort(() => {return 0.5 - Math.random()})
  return arr.join('');
}