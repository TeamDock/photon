#!/usr/bin/env node
import { Command } from 'commander';
import { version, name } from '../package.json';
import { install } from './api';

const program = new Command(name);
program.version(version);
process.title = name;

program
    .command('install')
    .alias('i')
    .arguments('<path|diretory>')
    .description('Install a plugin.')
    .action((args) => {
        install(args);
    });

function main(args: string[]) {
    program.parse(args);
}

main(process.argv);
