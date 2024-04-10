"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
class WsMemoryStore {
    constructor() {
        this.lastResponses = {};
    }
    async connect({ host = 'localhost', port = 22922, http2 = false } = {}) {
        this.socket = (0, socket_io_client_1.io)(`${http2 ? 'https' : 'http'}://${host}:${port}`);
        const res = await new Promise((resolve) => {
            this.socket.on("connect", () => {
                this.listeners();
                resolve('connected');
                console.log("connected");
            });
        });
        this.socket.removeAllListeners('connect');
        return res;
    }
    disconnect() {
        this.socket.disconnect();
    }
    async set(key, data) {
        this.socket.emit("set", {
            key,
            data
        });
        return key;
    }
    async get(key) {
        this.socket.emit("get", {
            key
        });
        return await this.waitForResponse(key);
    }
    async waitForResponse(key) {
        return new Promise((resolve) => {
            setInterval(() => {
                if (this.lastResponses[key]) {
                    resolve(this.lastResponses[key]);
                    delete this.lastResponses[key];
                }
            });
        });
    }
    listeners() {
        this.socket.on("set", (key) => {
            // console.log("listener set", key);
        });
        this.socket.on("get", ({ key, data }) => {
            // console.log("listener get", key, data);
            this.lastResponses[key] = data;
        });
        this.socket.on("disconnect", () => {
            console.log("disconnected");
        });
    }
}
exports.default = new WsMemoryStore();
