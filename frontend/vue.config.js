const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        fs: false,
        path: require.resolve("path-browserify"),
        assert: require.resolve("assert/"),
        util: require.resolve("util/")
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        // Define Vue feature flags here
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        // Add other feature flags if needed
      }),
    ],
  },
});

