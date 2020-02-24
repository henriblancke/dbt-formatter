export const lowercase = {
  input: 'select income, costs from finance;',
  result: `select
  income,
  costs
from
  finance;
`,
};

export const uppercase = {
  input: `select income, costs from finance;`,
  result: `SELECT
  income,
  costs
FROM
  finance;
`,
};

export const lowercaseCamel = {
  input: `select incomeStatement, COSTS from finance;`,
  result: `SELECT
  incomeStatement,
  costs
FROM
  finance;
`,
};

export const camelcase = {
  input: `select incomeStatement, COSTS from finance;`,
  result: `SELECT
  incomeStatement,
  COSTS
FROM
  finance;
`,
};

export const dbtSource = {
  input: `select one, two from {{source('test', 'table')}}`,
  result: `select
  one,
  two
from
  {{ source(
    'test',
    'table'
  ) }}
`,
};

export const dbtConfigBlock = {
  input: `{{ config(materialized='incremental', unique_key='table_id') }} select one,two from table`,
  result: `{{ config(
  materialized = 'incremental',
  unique_key = 'table_id'
) }}

select
  one,
  two
from
  table
`,
};

export const dbtRef = {
  input: `select name, lastname from {{ ref('people') }}`,
  result: `select
  name,
  lastname
from
  {{ ref('people') }}
`,
};

export const dbtRefWithClause = {
  input: `{{ config(materialized='incremental', unique_key='people_id') }}
  with new_table as (
    select name, lastname from {{ ref('people') }}
  )
  select *
  from new_table`,
  result: `{{ config(
  materialized = 'incremental',
  unique_key = 'people_id'
) }}

with new_table as (

  select
    name,
    lastname
  from
    {{ ref('people') }}
)
select
  *
from
  new_table
`,
};

export const nestedCaseStatement = {
  input: `{# This is a test comment #}
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
  result: `{# This is a test comment #}
{{ config(
  materialized = 'incremental'
) }}

SELECT
  {{ star(
    from = ref('snowplow_visits')
  ) }},
  COALESCE(
    visit_id,
    CASE
      WHEN page_name RLIKE '.*(landing|loading).*' THEN LEAD(session_id) ignore nulls over (
        PARTITION BY device_id,
        visit_id
        ORDER BY
          TIMESTAMP ASC
      )
      WHEN page_name RLIKE '.*(presentation|loading|page_view).*' THEN LAG(session_id) ignore nulls over (
        PARTITION BY device_id,
        visit_id
        ORDER BY
          TIMESTAMP ASC
      )
      ELSE session_id
    END
  ) AS session_case
FROM
  {{ ref('snowplow_visits') }}
`,
};

export const macroJinjaOperators = {
  input: `{% macro get_tables(db, schema, exclude='') %}

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

{% endmacro %}`,
  result: `{% macro get_tables(
    db,
    schema,
    exclude = ''
  ) %}
  {%- call statement(
      'tables',
      fetch_result = True
    ) %}
    {{ get_tables_sql(
      db,
      schema,
      exclude
    ) }}
  {%- endcall -%}

  {%- set table_list = load_result('tables') -%}
  {{ log(table_list) }}

  {%- if table_list and table_list ['data'] -%}
    {%- set tables = table_list ['data'] | map(
      attribute = 0
    ) | list %}
    {{ return(tables) }}
  {%- else -%}
    {{ return([]) }}
  {%- endif -%}
{% endmacro %}
`,
};

export const reservedSqlInJinja = {
  input: `{% macro star(from, relation_alias=False, except=[]) -%}

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
{%- endmacro %}`,
  result: `{% macro star(
    from,
    relation_alias = False,
    except = []
  ) -%}
  {#-- Prevent querying of db in parsing mode. This works because this macro does not create any new refs. #}
  {%- if not execute -%}
    {{ return('') }}
  {% endif %}

  {%- set include_cols = [] %}
  {%- set cols = adapter.get_columns_in_relation(from) -%}
  {%- for col in cols -%}
    {%- if col.column not in except -%}
      {% set _ = include_cols.append(
        col.column
      ) %}
    {%- endif %}
  {%- endfor %}

  {%- for col in include_cols %}
    {% if relation_alias %}
      {{ relation_alias }}.
    {% endif %}

    {{ dbt_utils.identifier(col) }}

    {% if not loop.last %},
    {% endif %}
  {%- endfor -%}
{%- endmacro %}
`,
};

export const jinjaVarAndEqual = {
  input: `SELECT * FROM stuff s
    LEFT JOIN {{ ref('mytable') }} AS tb
    ON {{ var }} = tb.col`,
  result: `SELECT
  *
FROM
  stuff s
  LEFT JOIN {{ ref('mytable') }} AS tb
  ON {{ var }} = tb.col
`,
};

export const arrowFormatConcat = {
  input: `SELECT
    user_id,
    created_datetime_utc,
    parsed_json.value ['userId'] as user_id,
    JSON ['company'] ::integer as company_id
  FROM
    {{ ref('table_with_json') }} AS tbl,
    LATERAL FLATTEN(
      input = > tbl.json ['travelers']
    ) parsed_json
  `,
  result: `SELECT
  user_id,
  created_datetime_utc,
  parsed_json.value ['userId'] as user_id,
  JSON ['company'] :: integer as company_id
FROM
  {{ ref('table_with_json') }} AS tbl,
  LATERAL FLATTEN(
    input => tbl.json ['travelers']
  ) parsed_json
`,
};

export const arrowFormat = {
  input: `SELECT
    user_id,
    created_datetime_utc,
    parsed_json.value ['userId'] as user_id,
    JSON ['company'] ::integer as company_id
  FROM
    {{ ref('table_with_json') }} AS tbl,
    LATERAL FLATTEN(
      input => tbl.json ['travelers']
    ) parsed_json
  `,
  result: `SELECT
  user_id,
  created_datetime_utc,
  parsed_json.value ['userId'] as user_id,
  JSON ['company'] :: integer as company_id
FROM
  {{ ref('table_with_json') }} AS tbl,
  LATERAL FLATTEN(
    input => tbl.json ['travelers']
  ) parsed_json
`,
};

export const dbtSnapshotSqlFormat = {
  input: `{% snapshot orders_snapshot %}

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
  result: `{% snapshot orders_snapshot %}
    {{ config(
        target_database = 'analytics',
        target_schema = 'snapshots',
        unique_key = 'id',
        strategy = 'timestamp',
        updated_at = 'updated_at',
    ) }}

    SELECT
        one AS three,
        two AS four
    FROM
        {{ source(
            'ecom',
            'orders'
        ) }} AS af
        LEFT JOIN tst
        ON af.id = tst.id
{% endsnapshot %}
`,
};
