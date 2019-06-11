/* eslint-disable no-console */
const formatter = require('../dist/lib/dbt-formatter');

console.log(formatter.default.format("{% set varm = 'some magic var' %}" +
 "{{ config(materialized='incremental', unique_key='unique_id') }}" +
 "select last_value(source_item_type) {{varm}} as magic_var, max(stuff) as stuff from my_table " +
 "group by stuff where stuff > 0 and source != 'things'"));

console.log('\n==================================\n')

console.log(formatter.default.format(`
with new_table as (
  select name, lastname from {{ ref('people') }}
)

select *
from new_table;
`))

console.log('\n==================================\n')


console.log(formatter.default.format(`{% macro get_tables(db, schema, exclude='') %}

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

{% endmacro %}`))

console.log('\n==================================\n')

console.log(formatter.default.format(`{% macro star(from, relation_alias=False, except=[]) -%}

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

        {% if relation_alias %} {{ relation_alias }}.{% endif %} {{ dbt_utils.identifier(col) }} {% if not loop.last %},
        {% endif %}

    {%- endfor -%}
{%- endmacro %}`))
