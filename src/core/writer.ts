import { writeFileSync, readFileSync } from 'fs';

export interface Writer {
  write(buffer: string): void;
}

export class FileWriter implements Writer {
  private fp: string;
  constructor(fp: string) {
    this.fp = fp;
  }
  write(buffer: string): void {
    // lets read the file first, and output to stdout if we actually modify it
    let original = readFileSync(this.fp);
    if (original.compare(Buffer.from(buffer))) {
      process.stdout.write(`${this.fp}\n`);
    }
    writeFileSync(this.fp, buffer);
  }
}
export class StdOutWriter implements Writer {
  write(buffer: string): void {
    process.stdout.write(buffer);
  }
}
