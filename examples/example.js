/* eslint-disable no-console */
const formatter = require('../dist/lib/dbt-formatter');

// console.log(formatter.format("{{ config(materialized='incremental', unique_key='tracks_page_dl_id') }} with events as (select * from {{ source('logging', 'tracks_page') }}) SELECT man as mann, woman, son FROM events {% if is_incremental() %} WHERE created > null {% endif %};", { sql: 'sql' }));

console.log(formatter.default.format("{% set varm = 'some magic var' %}" +
"{{ config(materialized='incremental', unique_key='tracks_page_dl_id') }}" +
"select last_value(source_item_type) {{varm}} as magic_var, max(stuff) as stuff from table " +
"group by stuff where stuff > 0 and source != 'things'"));
