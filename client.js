"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsMemoryStore = void 0;
const socket_io_client_1 = require("socket.io-client");
class WsMemoryStoreClient {
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
    async delete(key) {
        this.socket.emit("delete", {
            key
        });
        return key;
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
        this.socket.on("get", ({ key, data }) => {
            // console.log("listener get", key, data);
            this.lastResponses[key] = data;
        });
        this.socket.on("disconnect", () => {
            console.log("disconnected");
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new WsMemoryStoreClient();
        }
        return this.instance;
    }
}
exports.WsMemoryStore = WsMemoryStoreClient.getInstance();
