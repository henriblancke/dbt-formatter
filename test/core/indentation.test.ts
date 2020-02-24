import Indentation from '../../src/core/indentation';

describe('indent top level', () => {
  const indentation = new Indentation(4);

  it('getIndent should return no indent on init', () => {
    const result = indentation.getIndent();
    expect(result).toBe('');
  });

  it('getIndent should return an indent when the top level is increased', () => {
    indentation.increaseToplevel();
    const result = indentation.getIndent();
    expect(result).toBe('    ');

    const count = indentation.count();
    expect(count).toBe(1);
  });

  it('getIndent should return no indent when top level is decreased again', () => {
    indentation.decreaseTopLevel();
    const result = indentation.getIndent();
    expect(result).toBe('');

    const count = indentation.count();
    expect(count).toBe(0);
  });

  it('should return no indent when indentation is reset', () => {
    indentation.increaseToplevel();
    indentation.increaseToplevel();
    const count = indentation.count();
    expect(count).toBe(2);

    indentation.reset();
    const countReset = indentation.count();
    expect(countReset).toBe(0);

    const indentReset = indentation.getIndent();
    expect(indentReset).toBe('');
  });
});

describe('indent block level', () => {
  const indentation = new Indentation(4);
  it('getIndent should return no indent on init', () => {
    const result = indentation.getIndent();
    expect(result).toBe('');
  });

  it('getIndent should return 4 when block level is increased', () => {
    indentation.increaseBlockLevel();
    const result = indentation.getIndent();
    expect(result).toBe('    ');

    const count = indentation.count();
    expect(count).toBe(1);
  });

  it('getIndent should return no indent when block level is decreased again', () => {
    indentation.decreaseBlockLevel();
    const result = indentation.getIndent();
    expect(result).toBe('');

    const count = indentation.count();
    expect(count).toBe(0);
  });

  it('should return no indent when indentation is reset', () => {
    indentation.increaseBlockLevel();
    indentation.increaseBlockLevel();
    const count = indentation.count();
    expect(count).toBe(2);

    indentation.reset();
    const countReset = indentation.count();
    expect(countReset).toBe(0);

    const indentReset = indentation.getIndent();
    expect(indentReset).toBe('');
  });
});
