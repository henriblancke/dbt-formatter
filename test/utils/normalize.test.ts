import * as normalize from '../../src/utils/normalize';

describe('equalizeWhitespace', () => {
  it('should replace multiple whitespaces with a single whitespace', () => {
    const result = normalize.equalizeWhitespace('Hello      World');
    expect(result).toBe('Hello World');
  });

  it('should maintain single whitespaces', () => {
    const result = normalize.equalizeWhitespace('Hello World');
    expect(result).toBe('Hello World');
  });
});

describe('addWhitespace', () => {
  it('should append a whitespace', () => {
    const result = normalize.addWhitespace('Hello');
    expect(result).toBe('Hello ');
  });

  it('should prepend a whitespace', () => {
    const result = normalize.addWhitespace('Hello', true);
    expect(result).toBe(' Hello');
  });
});

describe('removeWhitespace', () => {
  it('should remove all excessive whitespaces', () => {
    const result = normalize.addWhitespace('   Hello   Bla  ');
    expect(result).toBe(' Hello Bla ');
  });
});
