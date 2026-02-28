import { cleanMarkdown } from '../lib/markdown-cleaner';

describe('cleanMarkdown', () => {
  it('returns original markdown when no H1 heading is found', () => {
    const input = 'Some content without a heading.';
    expect(cleanMarkdown(input)).toBe(input);
  });

  it('extracts title and paragraph content', () => {
    const input = [
      '# My Article',
      '',
      'Introduction paragraph that is long enough to pass the content check, with some punctuation.',
    ].join('\n');

    const result = cleanMarkdown(input);
    expect(result).toContain('# My Article');
    expect(result).toContain('Introduction paragraph');
  });

  it('skips TOC bullet links before content', () => {
    const input = [
      '# My Article',
      '',
      '- [Section One](#section-one)',
      '- [Section Two](#section-two)',
      '',
      'This is the actual introduction paragraph, which is long enough and has punctuation.',
    ].join('\n');

    const result = cleanMarkdown(input);
    expect(result).not.toContain('[Section One]');
    expect(result).toContain('This is the actual introduction');
  });

  it('skips plain TOC navigation items before content', () => {
    const input = [
      '# My Article',
      '',
      'Table of Contents',
      'Early Life',
      'Career',
      '',
      'This is a real paragraph with proper length and punctuation marks.',
    ].join('\n');

    const result = cleanMarkdown(input);
    expect(result).toContain('This is a real paragraph');
  });
});
