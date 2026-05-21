const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Required for Firebase JS SDK to resolve its internal .cjs files
if (!config.resolver.sourceExts.includes('cjs')) {
  config.resolver.sourceExts.push('cjs');
}

// CRITICAL: Disable unstable package exports resolution.
// Without this, Firebase's internal modules (auth, firestore, etc.) fail
// to register their components, causing the "Component auth has not been
// registered yet" error on React Native / Expo.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
