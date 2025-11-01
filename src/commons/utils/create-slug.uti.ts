export const createSlug = (name: string) => {
  if (!name || typeof name !== 'string') {
    return '';
  }
  return (
    name
      .trim()
      .toLowerCase()
      // Replace common separators (spaces, underscores, etc.) with hyphens
      .replace(/[\s_+/\\]+/g, '-')
      // Normalize accented characters to ASCII (e.g., café → cafe)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Remove any character that is not a letter, number, or hyphen
      .replace(/[^a-z0-9-]/g, '')
      // Collapse multiple consecutive hyphens into one
      .replace(/-+/g, '-')
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, '')
  );
};
