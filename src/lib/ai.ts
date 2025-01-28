import { Ollama } from 'ollama';
const defaultHost = 'http://localhost:11435';
if (!process.env.OLLAMA_HOST) {
  console.warn(`OLLAMA_HOST is not set, defaulting to ${defaultHost}`);
}
export const ollama = new Ollama({
  host: process.env.OLLAMA_HOST ?? defaultHost,
});
