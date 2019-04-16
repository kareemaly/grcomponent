const prompt = require('prompt');

module.exports = question => new Promise((resolve, reject) => {
  console.log('');
  prompt.get([].concat(question), (err, output) => {
    if (err) {
      return reject(err);
    }
    console.log('');
    return resolve(output);
  });
});
