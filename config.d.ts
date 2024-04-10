declare const DEFAULT_PORT = 22922;
declare const optionDefinitions: ({
    name: string;
    alias: string;
    type: NumberConstructor;
    defaultOption?: undefined;
} | {
    name: string;
    defaultOption: boolean;
    alias?: undefined;
    type?: undefined;
})[];
export { optionDefinitions, DEFAULT_PORT };
