import formatter from '../src/dbt-formatter';
import * as fixtures from './fixtures/queries';

describe('standard, non jinja flavored queries', () => {
  it('works when all reserved keys are lowercase', () => {
    const formatted = formatter(fixtures.lowercase.input);
    expect(formatted).toBe(fixtures.lowercase.result);
  });

  it('works when all reserved keys are uppercase', () => {
    const formatted = formatter(fixtures.uppercase.input, {
      sql: 'default',
      indent: 2,
      upper: true,
    });
    expect(formatted).toBe(fixtures.uppercase.result);
  });

  it('works when camcel case is preserved and column names are lowercased', () => {
    const formatted = formatter(fixtures.lowercaseCamel.input, {
      sql: 'default',
      indent: 2,
      upper: true,
      lowerWords: true,
      allowCamelcase: true,
    });
    expect(formatted).toBe(fixtures.lowercaseCamel.result);
  });

  it('works when camcel case is preserved and column names remain as provided', () => {
    const formatted = formatter(fixtures.camelcase.input, {
      sql: 'default',
      indent: 2,
      upper: true,
      allowCamelcase: true,
    });
    expect(formatted).toBe(fixtures.camelcase.result);
  });
});

describe('jinja flavored queries', () => {
  it('works when jinja variables are formatted', () => {
    const formatted = formatter(fixtures.dbtSource.input);
    expect(formatted).toBe(fixtures.dbtSource.result);
  });

  it('works when it formats a dbt config block', () => {
    const formatted = formatter(fixtures.dbtConfigBlock.input);
    expect(formatted).toBe(fixtures.dbtConfigBlock.result);
  });

  it('works when a dbt ref is formatted', () => {
    const formatted = formatter(fixtures.dbtRef.input);
    expect(formatted).toBe(fixtures.dbtRef.result);
  });

  it('works when a dbt ref inside a with clause is formatted', () => {
    const formatted = formatter(fixtures.dbtRefWithClause.input);
    expect(formatted).toBe(fixtures.dbtRefWithClause.result);
  });

  it('works with nested case statements', () => {
    const formatted = formatter(fixtures.nestedCaseStatement.input, {
      sql: 'default',
      indent: 2,
      upper: true,
      lowerWords: true,
      allowCamelcase: true,
    });
    expect(formatted).toBe(fixtures.nestedCaseStatement.result);
  });
});

describe('macro tests', () => {
  it('works with advanced macros that use jinja operators', () => {
    const formatted = formatter(fixtures.macroJinjaOperators.input);
    expect(formatted).toBe(fixtures.macroJinjaOperators.result);
  });

  it('works with reserved sql words inside template or variable blocks', () => {
    const formatted = formatter(fixtures.reservedSqlInJinja.input);
    expect(formatted).toBe(fixtures.reservedSqlInJinja.result);
  });

  it('works when a jinja variable and equal sign can exist on the same line', () => {
    const formatted = formatter(fixtures.jinjaVarAndEqual.input);
    expect(formatted).toBe(fixtures.jinjaVarAndEqual.result);
  });

  it('works when space between arrow func is removed', () => {
    const formatted = formatter(fixtures.arrowFormatConcat.input);
    expect(formatted).toBe(fixtures.arrowFormatConcat.result);
  });

  it('works when arrow func is respected', () => {
    const formatted = formatter(fixtures.arrowFormat.input);
    expect(formatted).toBe(fixtures.arrowFormat.result);
  });
});

describe('dbt snapshot tests', () => {
  it('works formats within a dbt snapshots block', () => {
    const formatted = formatter(fixtures.dbtSnapshotSqlFormat.input, {
      sql: 'default',
      indent: 4,
      upper: true,
      lowerWords: true,
    });
    expect(formatted).toBe(fixtures.dbtSnapshotSqlFormat.result);
  });
});
