import type { Pagination } from '../ambient';

type PaginationTag = 'curr' | 'prev' | 'next' | 'last';

export const parsePaginationInfo = (s: string | null): Pagination => {
  let result = {
    curr: '0',
    prev: '0',
    next: '0',
    last: '0'
  };

  if (!s) return result;

  const tags = s.split(',');

  tags.forEach(t => {
    const tag = processTag(t);

    tag && (result[tag.key] = tag.value);
  });

  return result;
};

const processTag = (s: string): { key: PaginationTag; value: string } | null => {
  const quoteRegex = /"(.*?)"/g;
  const bracketRegex = /<(.*?)>/g;

  const valueInQuotes = quoteRegex.exec(s);
  const valueInBrackets = bracketRegex.exec(s);

  if (valueInQuotes?.length && valueInBrackets?.length) {
    const key = valueInQuotes[1] as PaginationTag;

    return {
      key,
      value: valueInBrackets[1]
    };
  }

  return null;
};
