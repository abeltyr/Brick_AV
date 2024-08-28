import * as fs from "fs";
import am from "@/assets/language/am.json";
import en from "@/assets/language/en.json";
import { TranslationData, WordTranslation } from "@/types/languages";

const languageList = {
  am,
  en,
};

type langCodeType = "am" | "en";

export const translator = ({
  key,
  langCode,
}: {
  key: string;
  langCode: langCodeType;
}): WordTranslation | null => {
  try {
    const data: TranslationData = languageList[langCode];

    const language = data.language;

    const words = data.words;

    // Check if the key exists in the JSON data
    if (words[key]) {
      return words[key];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
    return null;
  }
};
