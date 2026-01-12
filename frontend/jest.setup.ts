import "@testing-library/jest-dom";

// Jest runs in a Node/CommonJS environment; `next-intl` ships ESM that Jest may not transform.
// For unit tests, a simple mock is sufficient.
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));
