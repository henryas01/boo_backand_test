export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  globals: {
   '^.+\\.ts?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json', // Example ts-jest option
        isolatedModules: true,         // Example ts-jest option
      },
    ],
  },
  testMatch: ["**/tests/**/*.test.ts"],
  clearMocks: true,
  verbose: true,
  testTimeout: 100000,
};
