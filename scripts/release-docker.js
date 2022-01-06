/* eslint-disable no-template-curly-in-string */
const execSync = require('child_process').execSync;
const platform = require('os').platform();

const commands = [
    'powershell docker run --rm -ti -v ${PWD}:/photon -w /photon electronuserland/builder npx electron-builder',
    'docker run --rm -ti -v ${PWD}:/photon -w /photon electronuserland/builder npx electron-builder',
];

const command = platform === 'win32' ? commands[0] : commands[1];

try {
    execSync(command, { stdio: 'inherit' });
} catch (e) {
    throw new Error(e);
}
