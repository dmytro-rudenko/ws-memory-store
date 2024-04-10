#!/usr/bin/env node

import { Server } from "socket.io";

const io = new Server({ /* options */ });

const memory: { [key: string]: string } = {};

io.on("connection", (socket) => {
    console.log("socket connected", socket.id);

    // save message handler
    socket.on("set", ({
        key,
        data
    }: {
        key: string,
        data: string
    }) => {
        memory[key] = data;

        io.emit("set", key);
    })

    // get message handler

    socket.on("get", ({ key }: { key: string }) => {
        const data = memory[key];

        io.emit("get", {
            key,
            data
        });
    })
});

io.listen(22922);