const path = require("path");

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      net: require.resolve("net-browserify"), // Add net-browserify for webpack to resolve net
      tls: require.resolve("tls-browserify"), // Add tls-browserify for webpack to resolve tls
    },
  },
  // Add other webpack configurations as needed
};
