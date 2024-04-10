#!/usr/bin/env node

import { Server } from "socket.io";
import commandLineArgs from "command-line-args";
import isString from "lodash/isString";
import { DEFAULT_PORT, optionDefinitions } from "./config";
import { KeyValue } from "./interfaces";

const options = commandLineArgs(optionDefinitions, { stopAtFirstUnknown: true });

if (options.command === 'serve') {
    const io = new Server({});
    const memory: { [key: string]: string } = {};

    io.on("connection", (socket) => {
        // save message handler
        socket.on("set", ({
            key,
            data
        }: KeyValue) => {
            if (isString(key) && isString(data)) {
                memory[key] = data;
            }
        })

        // get message handler
        socket.on("get", ({ key }: { key: string }) => {
            const data = memory[key];

            io.emit("get", {
                key,
                data
            });
        })

        // delete message handler
        socket.on("delete", ({ key }: { key: string }) => {
            delete memory[key];
        })
    });

    io.listen(options.port || DEFAULT_PORT);

    console.log(`WS Memory Store started and listening on port ${options.port || DEFAULT_PORT}`);
}

if (options.command === 'help') {
    console.log(`
    Ws Memory Store - Key Value Store based on WebSockets

    Usage:
        Commands:
            - command [serve] - Starts the websocket memory store server.
            - help            - Displays this help message.
        Flags:
            - port [number]   - Specifies the port to listen on. Default is ${DEFAULT_PORT}.

        Example:
            $ ws-memory-store serve -p ${DEFAULT_PORT}
    `);
    process.exit(0);
}