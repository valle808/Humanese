import { searchWikiSections, highlightText } from '../lib/search';
import type { WikiSection } from '../lib/types';

function makeSection(overrides: Partial<WikiSection> = {}): WikiSection {
  return {
    id: 'sec-1',
    title: 'Introduction',
    level: 1,
    content: 'This is the introduction paragraph with some details.',
    anchor: 'introduction',
    subsections: [],
    ...overrides,
  };
}

describe('searchWikiSections', () => {
  it('returns empty array when no sections match', () => {
    const sections = [makeSection({ title: 'History', content: 'Ancient times.' })];
    expect(searchWikiSections(sections, 'future')).toEqual([]);
  });

  it('matches by title', () => {
    const sections = [
      makeSection({ id: 'sec-1', title: 'Early Life', content: 'Born in 1970.' }),
    ];
    const results = searchWikiSections(sections, 'Early Life');
    expect(results).toHaveLength(1);
    expect(results[0].section.id).toBe('sec-1');
  });

  it('assigns higher score to title matches than content matches', () => {
    const sections = [
      makeSection({ id: 'content-match', title: 'History', content: 'The quantum leap happened.' }),
      makeSection({ id: 'title-match', title: 'Quantum Physics', content: 'An overview.' }),
    ];
    const results = searchWikiSections(sections, 'quantum');
    const titleResult = results.find(r => r.section.id === 'title-match')!;
    const contentResult = results.find(r => r.section.id === 'content-match')!;
    expect(titleResult.score).toBeGreaterThan(contentResult.score);
  });

  it('returns results sorted by score descending', () => {
    const sections = [
      makeSection({ id: 'low', title: 'Other', content: 'The word react appears here.' }),
      makeSection({ id: 'high', title: 'React Hooks', content: 'An overview.' }),
    ];
    const results = searchWikiSections(sections, 'react');
    expect(results[0].section.id).toBe('high');
  });

  it('searches recursively through subsections', () => {
    const child = makeSection({ id: 'child', title: 'Nested Section', content: 'Contains hidden keyword.' });
    const parent = makeSection({ id: 'parent', title: 'Parent', content: 'No match here.', subsections: [child] });
    const results = searchWikiSections([parent], 'hidden keyword');
    expect(results.some(r => r.section.id === 'child')).toBe(true);
  });

  it('is case-insensitive', () => {
    const sections = [makeSection({ title: 'Machine Learning', content: 'Neural networks explained.' })];
    expect(searchWikiSections(sections, 'machine learning')).toHaveLength(1);
    expect(searchWikiSections(sections, 'MACHINE LEARNING')).toHaveLength(1);
  });

  it('includes matching sentence excerpts in matches array', () => {
    const sections = [
      makeSection({ title: 'Science', content: 'Gravity is a fundamental force. Newton discovered gravity in 1687. Einstein revised it later.' }),
    ];
    const results = searchWikiSections(sections, 'gravity');
    const matches = results[0].matches;
    // At least one match should include sentence content containing 'gravity'
    const hasSentence = matches.some(m => m.toLowerCase().includes('gravity'));
    expect(hasSentence).toBe(true);
  });
});

describe('highlightText', () => {
  it('wraps query occurrences in <mark> tags', () => {
    expect(highlightText('Hello world', 'world')).toBe('Hello <mark>world</mark>');
  });

  it('is case-insensitive', () => {
    expect(highlightText('Hello World', 'world')).toBe('Hello <mark>World</mark>');
  });

  it('returns original text when query is empty string', () => {
    expect(highlightText('No change', '')).toBe('No change');
  });

  it('highlights all occurrences in the text', () => {
    const result = highlightText('foo bar foo', 'foo');
    expect(result).toBe('<mark>foo</mark> bar <mark>foo</mark>');
  });

  it('escapes special regex characters in the query', () => {
    const result = highlightText('price is $10.00', '$10.00');
    expect(result).toBe('price is <mark>$10.00</mark>');
  });
});
