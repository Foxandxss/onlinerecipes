import { createConfig } from '@nx/angular-rspack';

// Get public path from environment variable, default to root
const publicPath = process.env['PUBLIC_PATH'] || '/';

export default createConfig(
  {
    options: {
      root: __dirname,

      outputPath: {
        base: 'dist/onlinerecipes',
      },
      index: './src/index.html',
      browser: './src/main.ts',
      polyfills: ['zone.js'],
      tsConfig: './tsconfig.app.json',
      assets: [
        {
          glob: '**/*',
          input: './public',
        },
      ],
      styles: ['./src/styles.css'],
      devServer: {},
      baseHref: publicPath,
    },
  },
  {
    production: {
      options: {
        budgets: [
          {
            type: 'initial',
            maximumWarning: '500kb',
            maximumError: '1mb',
          },
          {
            type: 'anyComponentStyle',
            maximumWarning: '4kb',
            maximumError: '8kb',
          },
        ],
        outputHashing: 'all',
        devServer: {},
      },
      rspackOverride: (config) => {
        config.output = config.output || {};
        config.output.publicPath = publicPath;
        return config;
      },
    },

    development: {
      options: {
        optimization: false,
        vendorChunk: true,
        extractLicenses: false,
        sourceMap: true,
        namedChunks: true,
        devServer: {},
      },
    },
  }
);
