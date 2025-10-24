/// <reference types="@testing-library/jest-dom" />
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import '@testing-library/jest-dom/vitest';
import 'zone.js';
import 'zone.js/testing';

// Mock ResizeObserver for PrimeNG components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
