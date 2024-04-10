#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const command_line_args_1 = __importDefault(require("command-line-args"));
const isString_1 = __importDefault(require("lodash/isString"));
const config_1 = require("./config");
const options = (0, command_line_args_1.default)(config_1.optionDefinitions, { stopAtFirstUnknown: true });
if (options.command === 'serve') {
    const io = new socket_io_1.Server({});
    const memory = {};
    io.on("connection", (socket) => {
        // save message handler
        socket.on("set", ({ key, data }) => {
            if ((0, isString_1.default)(key) && (0, isString_1.default)(data)) {
                memory[key] = data;
            }
        });
        // get message handler
        socket.on("get", ({ key }) => {
            const data = memory[key];
            io.emit("get", {
                key,
                data
            });
        });
        // delete message handler
        socket.on("delete", ({ key }) => {
            delete memory[key];
        });
    });
    io.listen(options.port || config_1.DEFAULT_PORT);
    console.log(`WS Memory Store started and listening on port ${options.port || config_1.DEFAULT_PORT}`);
}
if (options.command === 'help') {
    console.log(`
    Ws Memory Store - Key Value Store based on WebSockets

    Usage:
        Commands:
            - command [serve] - Starts the websocket memory store server.
            - help            - Displays this help message.
        Flags:
            - port [number]   - Specifies the port to listen on. Default is ${config_1.DEFAULT_PORT}.

        Example:
            $ ws-memory-store serve -p ${config_1.DEFAULT_PORT}
    `);
    process.exit(0);
}
