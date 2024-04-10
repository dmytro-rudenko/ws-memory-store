#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server({ /* options */});
const memory = {};
io.on("connection", (socket) => {
    console.log("socket connected", socket.id);
    // save message handler
    socket.on("set", ({ key, data }) => {
        memory[key] = data;
        io.emit("set", key);
    });
    // get message handler
    socket.on("get", ({ key }) => {
        const data = memory[key];
        io.emit("get", {
            key,
            data
        });
    });
});
io.listen(22922);
