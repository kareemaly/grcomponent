const ucfirst = (s) =>
  s.charAt(0).toUpperCase() + s.slice(1);

const toCamelCase = (s) => {
  return s.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
};

const toPascalCase = (s) => ucfirst(toCamelCase(s));

const toUnderscoreCase = (s) =>
  s.split(/(?=[A-Z])/).join('_').toLowerCase();

const toHyphenCase = (s) =>
  s.split(/(?=[A-Z])/).join('-').toLowerCase();

module.exports = {
  toCamelCase,
  toPascalCase,
  toUnderscoreCase,
  toHyphenCase,
};
