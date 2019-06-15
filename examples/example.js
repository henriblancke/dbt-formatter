/* eslint-disable no-console */
const formatter = require('../dist/lib/dbt-formatter');
console.log(
  formatter.default
    .format(`{{ config(materialized='incremental', unique_key='tracks_user_action_dl_id') }}

SELECT
    tracks_user_action_dl_id,
    created_datetime_utc,
    json_data,
    json_data:actionName::string AS action_name,
    TRY_TO_TIMESTAMP_NTZ(json_data:servertimestamp::string) AS server_timestamp,
    TRY_TO_TIMESTAMP_NTZ(json_data:clienttimestamp::string) AS client_timestamp,
    TRY_TO_TIMESTAMP_NTZ(json_data:timestamp::string) AS timestamp_utc,
    json_data:deviceId::string AS device_id,
    json_data:sessionId::string AS session_id,
    json_data:visitId::string AS visit_id
FROM {{ source('logging','tracks_user_action') }}

{% if is_incremental() %}
WHERE created_datetime_utc >=
  (SELECT max(created_datetime_utc)
   FROM {{ this }})
{% endif %}`)
);

console.log('\n\n');

console.log(
  formatter.default.format(
    `
{{ config(materialized='incremental', unique_key='tracks_user_action_dl_id') }}
with new_table as (
  select name, lastname from {{ ref('people') }}
)

select *
from new_table
{% if is_incremental() %}
WHERE created_datetime_utc >=
  (SELECT max(created_datetime_utc)
   FROM {{ this }})
{% endif %}
`,
    { sql: 'default', indent: 4, upper: true }
  )
);

console.log('\n\n');

console.log(
  formatter.default.format(`{% macro get_tables(db, schema, exclude='') %}

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

{% endmacro %}`)
);

console.log('\n\n');

console.log(
  formatter.default
    .format(`{% macro star(from, relation_alias=False, except=[]) -%}

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
{%- endmacro %}`)
);
