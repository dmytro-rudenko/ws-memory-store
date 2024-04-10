#!/usr/bin/env node

import { Server } from "socket.io";
import commandLineArgs from "command-line-args";

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

const options = commandLineArgs(optionDefinitions, { stopAtFirstUnknown: true });

if (options.command === 'serve') {
    const io = new Server({ /* options */ });
    const memory: { [key: string]: string } = {};

    io.on("connection", (socket) => {
        // save message handler
        socket.on("set", ({
            key,
            data
        }: {
            key: string,
            data: string
        }) => {
            memory[key] = data;
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

    io.listen(options.port || 22922);

    console.log(`WS Memory Store started and listening on port ${options.port || 22922}`)
}

if (options.command === 'help') {
    console.log(`
    Ws Memory Store - Key Value Store based on WebSockets

    Usage:
        Commands:
            - command [serve] - Starts the websocket memory store server.
            - help            - Displays this help message.
        Flags:
            - port [number]   - Specifies the port to listen on. Default is 22922.

        Example:
            $ ws-memory-store serve -p 22922
    `);
    process.exit(0);
}