module.exports = {
  roots: ["<rootDir>/tests/unit"],
  testEnvironment: "jsdom",
  collectCoverageFrom: ["<rootDir>/src/**/*.{ts,tsx}"],
  coverageDirectory: "<rootDir>/reports/coverage",
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(css|sass|scss)$": "<rootDir>/tests/mocks/styleMock.js",
    "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/tests/mocks/fileMock.js",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
};
