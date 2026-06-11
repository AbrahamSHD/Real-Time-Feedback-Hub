export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '';

  // 1. Separate camelCase or PascalCase (e.g. "UpperCamelCase" -> "Upper Camel Case")
  let normalized = name.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // 2. Replace separators (snake_case, kebab-case) with spaces
  normalized = normalized.replace(/[_\-]+/g, ' ');

  // 3. Split into words ignoring extra whitespace
  const words = normalized.split(/\s+/).filter(Boolean);

  if (words.length === 0) return '';

  // 4. If there's only one word
  if (words.length === 1) {
    const word = words[0];
    
    // If it's an acronym or all uppercase (e.g., "PM", "US"), return up to 3 chars
    if (word === word.toUpperCase()) {
      return word.slice(0, 3);
    }
    
    // For normal single words (e.g. "Mole", "C"), return just the first letter
    return word.charAt(0).toUpperCase();
  }

  // 5. For multiple words, take the first letter of up to 3 words
  return words
    .slice(0, 3)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}
