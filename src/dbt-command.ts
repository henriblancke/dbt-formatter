import { readFileSync, fstat, writeFileSync } from 'fs';
import * as program from 'commander';
import formatter from './dbt-formatter';
import * as glob from 'glob';
import { Writer, StdOutWriter, FileWriter } from './core/writer';
import { writer } from 'repl';

program
  .option('-f, --file <file>', 'sql file to format')
  .option('-d, --directory <directory>', 'The directory to recursively search.')
  .option('-i', '--indent <spaces>', 'number of spaces for indent. Defaults to 4.')
  .option('--upper', 'upercase reserved sql words')
  .option('--replace', 'overwrites the linted file(s).')
  .parse(process.argv);

const writer_factory = (file:string): Writer => {
  return program.replace ? new FileWriter(file) : new StdOutWriter()
}

const do_work = (file: string) => {
  
  let query = readFileSync(file);
  let formatted = formatter(query.toString(), {
    sql:  'default',
    indent: program.indent || 4,
    upper: program.upper,
    allowCamelcase:  false,
  });
  let writer = writer_factory(file)
  writer.write(formatted)
  
}

if(program.file){
  do_work(program.file);
}else if (program.directory){
  let all_files = glob.sync(`${program.directory}/**/*.sql`)
  all_files.forEach(do_work)
}

