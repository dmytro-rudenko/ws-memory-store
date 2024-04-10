"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PORT = exports.optionDefinitions = void 0;
const DEFAULT_PORT = 22922;
exports.DEFAULT_PORT = DEFAULT_PORT;
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
];
exports.optionDefinitions = optionDefinitions;
