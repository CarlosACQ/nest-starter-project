export function capitalizeFirstLetter(string: string): string {
  const result = string.toLowerCase().trim();
  return result[0].toUpperCase() + string.slice(1);
}

export function capitalizeFirstLetterAllWords(string: string): string {
  const result = string.toLowerCase().trim();
  const pieces = result.split(' ');
  for (let i = 0; i < pieces.length; i++) {
    const j = pieces[i].charAt(0).toUpperCase();
    pieces[i] = j + pieces[i].slice(1);
  }
  return pieces.join(' ');
}
