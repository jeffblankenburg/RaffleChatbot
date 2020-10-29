function getRandomItem(items) {
  const random = getRandom(0, items.length - 1);
  return items[random];
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getCommaSeparatedList(array) {
  let string = '';
  for (let i = 0; i < array.length; i++) {
    string += `${array[i].id}`;
    if (i < array.length - 2) string += ', ';
    else if (i === array.length - 2) string += ', and ';
  }
  return string;
}

module.exports = {
  getCommaSeparatedList,
  getRandomItem,
  getRandom
};
