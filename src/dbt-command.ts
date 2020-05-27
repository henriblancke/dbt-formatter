import * as glob from 'glob';
import { readFileSync } from 'fs';
import * as program from 'commander';

import formatter from './dbt-formatter';
import { Writer, StdOutWriter, FileWriter } from '@core/writer';

program
  .option('-f, --file <file>', 'sql file to format')
  .option('-d, --directory <directory>', 'The directory to recursively search.')
  .option('-i', '--indent <spaces>', 'number of spaces for indent. Defaults to 4.')
  .option('--upper', 'upercase reserved sql words')
  .option('--replace', 'overwrites the linted file(s).')
  .option('--camelcase', 'allow column names to be camel cased')
  .parse(process.argv);

const factory = (file: string): Writer => {
  return program.replace ? new FileWriter(file) : new StdOutWriter();
};

const worker = (file: string) => {
  const query = readFileSync(file);
  const formatted = formatter(query.toString(), {
    sql: 'default',
    indent: program.indent || 4,
    upper: program.upper,
    allowCamelcase: program.camelcase,
  });

  const writer = factory(file);
  writer.write(formatted);
};

if (program.file) {
  worker(program.file);
} else if (program.directory) {
  const allFiles = glob.sync(`${program.directory}/**/*.sql`);
  allFiles.forEach(worker);
}
