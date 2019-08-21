const test1 = `select
  income,
  costs
from
  finance;
`;

const test2 = `SELECT
  income,
  costs
FROM
  finance;
`;

const test3 = `SELECT
  incomeStatement,
  costs
FROM
  finance;
`;

const test4 = `select
  one,
  two
from
  {{ source(
    'test',
    'table'
  ) }}
`;

const test5 = `{{ config(
  materialized = 'incremental',
  unique_key = 'table_id'
) }}

select
  one,
  two
from
  table
`;

const test6 = `{{ config(
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
`;

const test7 = `{% macro get_tables(
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
`;

const test8 = `{% macro star(
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
`;

const test9 = `{# This is a test comment #}
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
`;

const test10 = `{% snapshot orders_snapshot %}
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
        LEFT JOIN tst ON af.id = tst.id
{% endsnapshot %}
`;

export { test1, test2, test3, test4, test5, test6, test7, test8, test9, test10 };
