// Define the structure of a single word's translation object
export interface WordTranslation {
  translation: string;
  detail: string;
}

// Define the structure of the words object where each key is a word
export interface Words {
  [key: string]: WordTranslation;
}

// Define the structure of the entire JSON object
export interface TranslationData {
  language: string;
  words: Words;
}
