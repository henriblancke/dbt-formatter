/* eslint-disable no-console */
const formatter = require('../dist/lib/dbt-formatter');

console.log(formatter.default.format("{% set varm = 'some magic var' %}" +
"{{ config(materialized='incremental', unique_key='tracks_page_dl_id') }}" +
"select last_value(source_item_type) {{varm}} as magic_var, max(stuff) as stuff from table " +
"group by stuff where stuff > 0 and source != 'things'"));
