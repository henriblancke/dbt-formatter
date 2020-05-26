import {writeFileSync, readFileSync} from 'fs'; 


export interface Writer{
    write(buffer: string) : void
}

export class FileWriter implements Writer{
    private file_path: string;
    constructor(file_path: string){
        this.file_path = file_path;
    }
    write(buffer: string): void {
        // lets read the file first, and output to stdout if we actually modify it
        let original = readFileSync(this.file_path)
        if(original.compare(Buffer.from(buffer))){
            process.stdout.write(`${this.file_path}\n`);
        }
        writeFileSync(this.file_path, buffer)
    }
    
}
export class StdOutWriter implements Writer{
    
    write(buffer: string): void {
        process.stdout.write(buffer)
    }

}