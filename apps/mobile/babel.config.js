module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Add the dotenv plugin. It must be listed after the reanimated plugin if present.
      [
        "module:react-native-dotenv",
        {
          "moduleName": "@env",
          "path": ".env",
          "blacklist": null,
          "whitelist": null,
          "safe": false,
          "allowUndefined": true,
        },
      ],
      // Required for expo-router
      "expo-router/babel",
    ],
  };
};