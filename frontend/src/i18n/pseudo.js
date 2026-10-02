/**
 * Pseudo-Localization Engine (en-XA)
 * Transforms English strings into expanded accented pseudo-strings to test:
 * 1. Untranslated hardcoded English strings (which won't have [!! ... !!])
 * 2. Layout overflow & line breaking with ~35% text length expansion
 * 
 * Preserves interpolation tags {{var}} and HTML tags <span>, <br/>, etc.
 */

const CHAR_MAP = {
  a: 'áá', b: 'ƀ', c: 'č', d: 'đ', e: 'éé', f: 'ƒ', g: 'ĝ', h: 'ĥ', i: 'íí',
  j: 'ĵ', k: 'ќ', l: 'ł', m: 'ɱ', n: 'ñ', o: 'óó', p: 'þ', q: 'q', r: 'ř',
  s: 'š', t: 'ŧ', u: 'úú', v: 'ṽ', w: 'ŵ', x: 'ж', y: 'ý', z: 'ž',
  A: 'ÁÁ', B: 'Ɓ', C: 'Č', D: 'Đ', E: 'ÉÉ', F: 'Ƒ', G: 'Ĝ', H: 'Ĥ', I: 'ÍÍ',
  J: 'Ĵ', K: 'Ќ', L: 'Ł', M: 'Ɱ', N: 'Ñ', O: 'ÓÓ', P: 'Þ', Q: 'Q', R: 'Ř',
  S: 'Š', T: 'Ŧ', U: 'ÚÚ', V: 'Ṽ', W: 'Ŵ', X: 'Ж', Y: 'Ý', Z: 'Ž',
};

export const toPseudoString = (str) => {
  if (typeof str !== 'string' || !str.trim()) return str;

  // Split by placeholders {{...}} and HTML tags <...>
  const tokens = str.split(/(\{\{[^}]+\}\}|<[^>]+>)/g);

  const transformed = tokens.map((token) => {
    // If it's a placeholder or HTML tag, preserve as-is
    if (token.startsWith('{{') || token.startsWith('<')) {
      return token;
    }

    return token
      .split('')
      .map((ch) => CHAR_MAP[ch] || ch)
      .join('');
  }).join('');

  return `[!! ${transformed} !!]`;
};

export const transformObjectToPseudo = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return typeof obj === 'string' ? toPseudoString(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformObjectToPseudo);
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = transformObjectToPseudo(value);
  }
  return result;
};

export default {
  toPseudoString,
  transformObjectToPseudo,
};
