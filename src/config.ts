const DEFAULT_PORT = 22922;

const optionDefinitions = [
    {
        name: "port",
        alias: "p",
        type: Number
    },
    {
        name: 'command',
        defaultOption: true,
    }
]

export { optionDefinitions, DEFAULT_PORT }