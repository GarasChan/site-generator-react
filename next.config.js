const withLess = require('next-with-less');

/** @type {import('next').NextConfig} */
module.exports = withLess({
  reactStrictMode: false,
  lessLoaderOptions: {
    lessOptions: {
      modifyVars: {
        'arco-theme-tag': '.arco-theme'
      }
    }
  }
});
