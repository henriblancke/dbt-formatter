import { readFileSync } from 'fs';
import * as program from 'commander';
import formatter from './dbt-formatter';

program
  .requiredOption('-f, --file <file>', 'sql file to format')
  .option('--sql <flavour>', 'what sql flavor to use')
  .option('--camelcase', 'allow camelcase')
  .option('-i', '--indent <spaces>', 'how much to spaces for indentations')
  .option('---no-upper', 'disable uppercasing reserved sql words')
  .parse(process.argv);

const query = readFileSync(program.file);
const formatted = formatter(query.toString(), {
  sql: program.sql || 'default',
  indent: program.indent || 2,
  upper: program.upper || true,
  allowCamelcase: program.camelcase || false,
});

process.stdout.write(formatted);
