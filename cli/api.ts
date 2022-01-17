import path from 'path';
import fs from 'fs';
import { copySync } from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import getAppDataPath from 'appdata-path';
import { ThemeType } from '../@types/theme';
import { isInstalledTheme, isTheme, isThemePath } from './utils';

function install(plugin: string) {
    preparePlugin(plugin);
    installTheme(plugin);
}

function preparePlugin(plugin: string) {
    // is a path or url
    if (fs.existsSync(plugin)) {
        const pluginPath = path.resolve(plugin);

        // is a theme or plugin
        if (isThemePath(plugin)) {
            validateTheme(pluginPath);
        } else {
            validatePlugin(pluginPath);
        }
    } else {
        // is a theme or plugin
        if (isTheme(plugin)) {
            const themePath = getPathWithPluginInstalled(plugin, true);
            if (themePath) {
                validateTheme(themePath);
            } else {
                // TODO install named theme
            }
        } else {
            const pluginPath = getPathWithPluginInstalled(plugin);
            if (pluginPath) {
                validatePlugin(pluginPath);
            } else {
                // TODO install named plugin
            }
        }
    }
}

function validatePlugin(plugin: string) {}

function validateTheme(theme: string) {
    const spinner = ora('Validating theme...');
    spinner.start();

    if (!fs.statSync(theme).isDirectory()) {
        spinner.fail();
        console.error(chalk.red('Cannot install the theme.'));
        console.error(`${theme} is not a directory.`);
        process.exit(1);
    }

    const themeFile = JSON.parse(
        fs.readFileSync(path.join(theme, 'theme.json')).toString()
    ) as ThemeType;

    if (themeFile.css) {
        if (path.resolve(themeFile.css) === path.normalize(themeFile.css)) {
            if (!fs.existsSync(themeFile.css)) {
                spinner.fail();
                console.error(chalk.red('Cannot find file.'));
                console.error(
                    chalk.red(`The file ${themeFile.css} doesn't exists.`)
                );
            }
        } else {
            if (!fs.existsSync(path.join(theme, themeFile.css))) {
                spinner.fail();
                console.error(chalk.red('Cannot find file.'));
                console.error(
                    chalk.red(
                        `The file ${path.join(
                            theme,
                            themeFile.css
                        )} doesn't exists.`
                    )
                );
            }
        }
    }

    spinner.succeed();
}

function installTheme(theme: string) {
    const spinner = ora('Installing theme...');
    spinner.start();

    let themePath: string;
    if (fs.existsSync(theme)) {
        themePath = theme;
    } else {
        const pathInstalledTheme = getPathWithPluginInstalled(theme, true);
        if (!pathInstalledTheme) {
            spinner.fail();
            console.error(chalk.red('Cannot install the theme.'));
            console.error(`The theme ${theme} doesn't exists.`);
            process.exit(1);
        }
        themePath = pathInstalledTheme;
    }

    const themesPath = path.join(getAppDataPath(), 'photon', 'Themes');
    const themeFile = JSON.parse(
        fs.readFileSync(path.join(themePath, 'theme.json')).toString()
    ) as ThemeType;

    if (isInstalledTheme(theme)) {
        setConfig();
        return;
    }

    fs.mkdirSync(path.join(themesPath, themeFile.name), {
        recursive: true,
    });
    copySync(
        themePath,
        path.join(getAppDataPath(), 'photon', 'Themes', themeFile.name)
    );

    setConfig();

    function setConfig() {
        const configFile = JSON.parse(
            fs
                .readFileSync(
                    path.join(
                        getAppDataPath(),
                        'photon',
                        'Config',
                        'config.json'
                    )
                )
                .toString()
        );

        configFile.photonTheme = themeFile.name;

        fs.writeFileSync(
            path.join(getAppDataPath(), 'photon', 'Config', 'config.json'),
            JSON.stringify(configFile, null, 4)
        );

        spinner.succeed('Done!');
        console.log(chalk.italic('Restart Photon if it has opened.'));
    }
}

function getPathWithPluginInstalled(theme: string, isTheme?: boolean) {
    const pluginPath = path.join(
        getAppDataPath(),
        'photon',
        isTheme ? 'Themes' : 'Plugins',
        theme
    );

    return fs.existsSync(pluginPath) ? pluginPath : null;
}

export { install };
