import { FontWeight, ITheme } from 'xterm';

type ThemeType = {
    name: string;
    author: string;
    version: string;
    theme: ITheme;
    cursor?: {
        width?: number;
        style?: 'block' | 'underline' | 'bar';
        blink?: boolean;
    };
    font?: {
        family?: string;
        size?: number;
        weight?: FontWeight;
        weightBold?: FontWeight;
    };
    taskbar?: {
        background?: string;
        color?: string;
    };
    css?: string;
};

type IThemeType = ThemeType & {
    path: string;
};

export { ThemeType, IThemeType };
