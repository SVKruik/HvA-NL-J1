// This library is for the rendered tests, it adds expect functions like toBeInTheDocument and more
import "@testing-library/jest-dom";

// This is for the middleware, definePageMeta is defined global
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.definePageMeta = () => {};
