const Mustache = require('mustache');
const util = require('util');
const fs = require('fs');
const path = require('path');
const {
  toCamelCase,
  toPascalCase,
  toHyphenCase,
} = require('./utils/stringCaseConverter');

const readFileP = util.promisify(fs.readFile);

const defaultOptions = {
  componentName: '',
  propTypes: false,
  styledComponents: false,
  cssModule: false,
  styleguidist: false,
  cssExtension: 'css',
  type: 'function',
};

const templatesDir = path.resolve(__dirname, 'templates');

const readTemplateToString = template =>
  readFileP(path.resolve(templatesDir, `${template}.mst`))
    .then(buffer => buffer.toString());

module.exports = async (opts) => {
  const {
    componentName,
    propTypes,
    styledComponents,
    cssModule,
    cssExtension,
    type,
    styleguidist,
  } = Object.assign({}, defaultOptions, opts);

  if (!componentName) {
    throw new Error('options.componentName is required');
  }

  if (['-', '_'].some(char => componentName.indexOf(char) > -1)) {
    throw new Error('options.componentName can\'t contain - or _');
  }

  const component = {
    hyphenSeparatedName: toHyphenCase(componentName),
    camelCaseName: toCamelCase(componentName),
    pascalCaseName: toPascalCase(componentName),
  };

  const renderProps = {
    component,
    propTypes,
    styledComponents,
    cssModule,
    cssExtension,
  };

  let componentString;

  if (type === 'function') {
    componentString = Mustache.render(
      await readTemplateToString('react-function-component'),
      renderProps
    );
  }

  else if (type === 'class') {
    componentString = Mustache.render(
      await readTemplateToString('react-class-component'),
      renderProps
    );
  }

  else {
    throw new Error('options.type must be function or class')
  }

  const files = [
    {
      extension: 'js',
      name: 'index',
      content: Mustache.render(await readTemplateToString('react-component'), {
        ...renderProps,
        componentString: () => () => {
          return componentString;
        },
      }),
    }
  ];

  if (cssModule) {
    files.push({
      extension: cssExtension,
      name: `${component.hyphenSeparatedName}.module`,
      content: Mustache.render(await readTemplateToString('css-module'), renderProps),
    });
  }

  if (styleguidist) {
    files.push({
      extension: 'md',
      name: `${component.pascalCaseName}`,
      content: Mustache.render(await readTemplateToString('styleguidist'), renderProps),
    });
  }

  return {
    directory: component.pascalCaseName,
    files,
  };
};
