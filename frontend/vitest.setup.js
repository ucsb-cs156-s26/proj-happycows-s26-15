// vitest.setup.js
import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";

const localStorageStore = {};

const localStorageMock = {
  getItem: vi.fn((key) => localStorageStore[key] ?? null),

  setItem: vi.fn((key, value) => {
    localStorageStore[key] = value.toString();
  }),

  removeItem: vi.fn((key) => {
    delete localStorageStore[key];
  }),

  clear: vi.fn(() => {
    Object.keys(localStorageStore).forEach((key) => {
      delete localStorageStore[key];
    });
  }),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

beforeEach(() => {
  localStorage.clear();

  localStorage.getItem.mockClear();
  localStorage.setItem.mockClear();
  localStorage.removeItem.mockClear();
  localStorage.clear.mockClear();
});