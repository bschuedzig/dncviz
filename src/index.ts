import fs from 'fs';
import os from 'os';
import path from 'path';
import process from 'process';
import { DgFile } from './types';

if (process.argv.length < 4) {
    console.log('Missing arguments');
    process.exit(1);
}

const DG_FILE = process.argv[2]!;
const DOT_FILE = process.argv[3]!;
const FILTER = process.argv.length > 4 ? process.argv[4] : undefined;

function shorten(path: string) {
    const result = extractFilename(path)
        .replace('.csproj', '')
        .replace(/\./g, '_');

    return result;
}

function extractFilename(file: string): string {
    return path.parse(file).base;
}

function generate(dgFile: string, dotFile: string, blacklist?: string) {

    if (!fs.existsSync(dgFile)) {
        console.log(`${dgFile} does not exist`);
        process.exit(1);
    }

    let output = '';
    function writeln(s: string) {
        output += `${s}${os.EOL}`
    }

    const json: DgFile = JSON.parse(fs.readFileSync(dgFile, 'utf8'));
    const projects = Object.keys(json.projects)
        .filter(x => {
            if (blacklist == null) return true;
            return new RegExp(blacklist).test(x) === false;
        })

    writeln('digraph dependencies {');

    projects.forEach(projectPath => {
        const project = json.projects[projectPath]!;

        Object.keys(project.restore.frameworks['netcoreapp3.1'].projectReferences)
            .forEach(referencePath => {
                writeln(`  ${shorten(projectPath)} -> ${shorten(referencePath)}`);
            })
    });

    writeln('}');

    fs.writeFileSync(dotFile, output, 'utf8');
    console.log(`${dotFile} written`);
}

generate(DG_FILE, DOT_FILE, FILTER);
