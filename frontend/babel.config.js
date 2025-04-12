module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  plugins: [
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ],
  overrides: [
    {
      test: /node_modules\/@mui\/system/,
      presets: ["@babel/preset-env"]
    }
  ]
};
