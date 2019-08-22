import * as result from './formatted-results';
import formatter from '../src/dbt-formatter';

describe('standard query tests', () => {
  it('works if all reserved keys are lowercase', () => {
    const formatted = formatter(`select income, costs from finance;`);
    expect(formatted).toBe(result.test1);
  });

  it('works if all reserved keys are uppercase', () => {
    const formatted = formatter(`select income, costs from finance;`, {
      sql: 'default',
      indent: 2,
      upper: true,
    });
    expect(formatted).toBe(result.test2);
  });

  it('works if camcel case is preserved and words are lowercased', () => {
    const formatted = formatter(`select incomeStatement, COSTS from finance;`, {
      sql: 'default',
      indent: 2,
      upper: true,
      lowerWords: true,
      allowCamelcase: true,
    });
    expect(formatted).toBe(result.test3);
  });

  it('works with nested case statements', () => {
    const formatted = formatter(
      `{# This is a test comment #}
    {{ config(materialized = 'incremental') }}

     SELECT
      {{ star(from=ref('snowplow_visits')) }},
      COALESCE(
        visit_id,
        case
          WHEN page_name rlike '.*(landing|loading).*' THEN lead(session_id) ignore nulls over (
            PARTITION BY device_id,
            visit_id
            ORDER BY
              timestamp ASC
          )
          WHEN page_name rlike '.*(presentation|loading|page_view).*' THEN lag(session_id) ignore nulls over (
            PARTITION BY device_id,
            visit_id
            ORDER BY
              timestamp ASC
          )
          ELSE session_id
        end
      ) AS session_case
    FROM
      {{ ref('snowplow_visits') }}`,
      {
        sql: 'default',
        indent: 2,
        upper: true,
        lowerWords: true,
        allowCamelcase: true,
      }
    );
    expect(formatted).toBe(result.test9);
  });
});

describe('jinja variable tests', () => {
  it('works when jinja variables are formatted', () => {
    const formatted = formatter(`select one, two from {{source('test', 'table')}}`);
    expect(formatted).toBe(result.test4);
  });

  it('works as a dbt config block', () => {
    const formatted = formatter(
      `{{ config(materialized='incremental', unique_key='table_id') }} select one,two from table`
    );
    expect(formatted).toBe(result.test5);
  });

  it('works with as ref within a with statement', () => {
    const formatted = formatter(
      `{{ config(materialized='incremental', unique_key='people_id') }}
      with new_table as (
        select name, lastname from {{ ref('people') }}
      )
      select *
      from new_table`
    );
    expect(formatted).toBe(result.test6);
  });
});

describe('macro tests', () => {
  it('works with advanced macros that use jinja operators', () => {
    const formatted = formatter(
      `{% macro get_tables(db, schema, exclude='') %}

    {%- call statement('tables', fetch_result=True) %}

    {{ get_tables_sql(db, schema, exclude) }}

        {%- endcall -%}

        {%- set table_list = load_result('tables') -%}

        {{ log(table_list) }}

        {%- if table_list and table_list['data'] -%}
            {%- set tables = table_list['data'] | map(attribute=0) | list %}
            {{ return(tables) }}
        {%- else -%}
            {{ return([]) }}
        {%- endif -%}

    {% endmacro %}`
    );
    expect(formatted).toBe(result.test7);
  });

  it('works with reserved sql words inside template or variable blocks', () => {
    const formatted = formatter(
      `{% macro star(from, relation_alias=False, except=[]) -%}

      {#-- Prevent querying of db in parsing mode. This works because this macro does not create any new refs. #}
      {%- if not execute -%}
          {{ return('') }}
      {% endif %}

      {%- set include_cols = [] %}
      {%- set cols = adapter.get_columns_in_relation(from) -%}
      {%- for col in cols -%}

          {%- if col.column not in except -%}
              {% set _ = include_cols.append(col.column) %}

          {%- endif %}
      {%- endfor %}

      {%- for col in include_cols %}

          {% if relation_alias %} {{ relation_alias }}.{% endif %} {{ dbt_utils.identifier(col) }}
          {% if not loop.last %},
          {% endif %}

      {%- endfor -%}
  {%- endmacro %}`
    );
    expect(formatted).toBe(result.test8);
  });
});

describe('dbt snapshot tests', () => {
  it('works formats within a dbt snapshots block', () => {
    const formatted = formatter(
      `{% snapshot orders_snapshot %}

      {{
          config(
            TARGET_database='analytics',
            target_schema='snapshots',
            unique_key='id',

            strategy='timestamp',
            updated_at='updated_at',
          )
      }}

      select one as Three, two as four from {{ source('ecom', 'orders') }} as af left join tst on af.id = tst.id

  {% endsnapshot %}`,
      { sql: 'default', indent: 4, upper: true, lowerWords: true }
    );

    expect(formatted).toBe(result.test10);
  });
});
