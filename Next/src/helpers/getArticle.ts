export function getArticle(word: string): string {
  if (!word) return "a";

  const vowels: string[] = ["a", "e", "i", "o", "u"];

  const isVowel: boolean = vowels.includes(word[0].toLowerCase());

  return isVowel ? "an" : "a";
}

export default getArticle;
