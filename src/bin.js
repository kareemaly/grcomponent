#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const getComponentFiles = require('./getComponentFiles');

const run = async ({
  componentsPath,
  componentNames,
  ...options
}) => {
  const promises = componentNames.map(async componentName => {
    const component = await getComponentFiles({
      componentName,
      ...options,
    });

    const componentPath = path.join(componentsPath, component.directory);

    await fs.ensureDir(componentPath);

    return Promise.all(
      component.files.map(({ extension, name, content }) =>
        fs.writeFile(
          path.resolve(componentPath, `${name}.${extension}`),
          content,
        )
      )
    );
  });

  await Promise.all(promises);
};

const args = require('yargs')
  .usage('Usage: $0 [options]')
  .help('h')
  .describe('components', 'comma separated component names')
  .describe('path', 'path to store your components')
  .describe('type', `one of 'function' or 'class`)
  .describe('proptypes', `whether to use prop-types`)
  .describe('styled', `whether to use styled-components`)
  .describe('cssmodule', `whether to use css modules`)
  .describe('styleguidist', `will add markdown file for styleguidist`)
  .describe('cssext', `css extension to use in case of --cssmodule`)
  .boolean('proptypes')
  .boolean('styled')
  .boolean('cssmodule')
  .boolean('styleguidist')
  .demandOption(['components', 'path'])
  .argv;

run({
  componentsPath: args.path,
  componentNames: args.components.split(','),
  propTypes: args.proptypes,
  styledComponents: args.styled,
  cssModule: args.cssmodule,
  cssExtension: args.cssext,
  styleguidist: args.styleguidist,
  type: args.type,
}).catch(console.error);
