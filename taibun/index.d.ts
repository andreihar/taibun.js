interface ConverterOptions {
    system?: 'Tailo' | 'POJ' | 'Zhuyin' | 'TLPA' | 'Pingyim' | 'Tongiong' | 'IPA';
    dialect?: 'south' | 'north';
    format?: 'mark' | 'number' | 'strip';
    delimiter?: string;
    sandhi?: 'auto' | 'none' | 'excLast' | 'inclLast';
    punctuation?: 'format' | 'none';
    convertNonCjk?: boolean;
}

export class Converter {
    constructor(options?: ConverterOptions);
    get(input: string): string;
}

export class Tokeniser {
    constructor(keepOriginal?: boolean);
    tokenise(input: string): string[];
}

export function isCjk(input: string): boolean;
export function toTraditional(input: string): string;
export function toSimplified(input: string): string;