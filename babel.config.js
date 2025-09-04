module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['babel-plugin-dotenv-import', {
      moduleName: '@env',
      path: '.env',
    }]
  ]
};
