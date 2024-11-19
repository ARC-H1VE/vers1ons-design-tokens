// build script for design tokens

import customFormats from './customFormats.js';
import StyleDictionary from 'style-dictionary';

async function asyncBuild() {
  const tokenDirectory = './tokens';
  const distDirectory = './dist';

  // Configure the output of style dictionary
  const styleDictionary = new StyleDictionary({
    source: [`${tokenDirectory}/design-tokens.tokens.json`],
    platforms: {
      css: {
        transformGroup: "css",
        buildPath: `${distDirectory}/css/`,
        files: [
          {
            format: "css/variables",
            destination: "auto-generated-tokens.css",
            options: {
              "outputReferences": true
            }
          }
        ]
      },
      ts: {
        transformGroup: "js",
        buildPath: `${distDirectory}/ts/`,
        files: [
          {
            "format": "javascript/module",
            "destination": "auto-generated-tokens.ts"
          },
          {
            "format": "typescript/module-declarations",
            "destination": "auto-generated-tokens.d.ts"
          }
        ]
      },
      js: {
        options: {
          showFileHeader: false,
        },
        transforms: [
          'name/camel',
          'attribute/cti',
          'size/rem',
          'color/hex',
        ],
        buildPath: `${distDirectory}/js/`,
        files: [
          {
            destination: 'auto-generated-tokens.js',
            format: 'javascript/custom',
          },
        ],
      },
    },
  });


  await styleDictionary.hasInitialized;

  styleDictionary.registerFormat(customFormats.javascriptCustomNestedObjects);
  // styleDictionary.cleanAllPlatforms();
  await styleDictionary.buildAllPlatforms();
}

asyncBuild();
