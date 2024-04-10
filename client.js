"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsMemoryStore = void 0;
const socket_io_client_1 = require("socket.io-client");
const config_1 = require("./config");
class WsMemoryStoreClient {
    constructor() {
        this.lastResponses = {};
    }
    async connect({ host = 'localhost', port = config_1.DEFAULT_PORT, http2 = false } = {}) {
        this.socket = (0, socket_io_client_1.io)(`${http2 ? 'https' : 'http'}://${host}:${port}`);
        const res = await new Promise((resolve) => {
            this.socket.on("connect", () => {
                resolve('connected');
            });
        });
        this.socket.removeAllListeners('connect');
        this.listeners();
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
        return this.waitForResponse(key);
    }
    async delete(key) {
        this.socket.emit("delete", {
            key
        });
        return key;
    }
    async waitForResponse(key) {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.lastResponses[key]) {
                    const data = this.lastResponses[key];
                    delete this.lastResponses[key];
                    clearInterval(interval);
                    resolve(data);
                }
            });
        });
    }
    listeners() {
        this.socket.on("get", ({ key, data }) => {
            this.lastResponses[key] = data;
        });
        this.socket.on("disconnect", () => {
            // console.log("disconnected");
        });
    }
}
exports.WsMemoryStore = new WsMemoryStoreClient();
