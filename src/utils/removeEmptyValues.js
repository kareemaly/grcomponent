module.exports = obj => Object.keys(obj)
  .filter(k => !!obj[k])
  .reduce((acc, k) => ({
    ...acc,
    [k]: obj[k],
  }), {});
