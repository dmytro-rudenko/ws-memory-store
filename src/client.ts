import { io } from "socket.io-client";
import { DEFAULT_PORT } from "./config";
import { KeyValue } from "./interfaces";

class WsMemoryStoreClient {
    socket: any
    lastResponses: {
        [key: string]: string 
    } = {}

    public async connect({
        host = 'localhost',
        port = DEFAULT_PORT,
        http2 = false
    }: {
        host?: string,
        port?: number,
        http2?: boolean
    } = {}) {
        this.socket = io(`${http2 ? 'https' : 'http'}://${host}:${port}`);

        const res = await new Promise((resolve) => {
            this.socket.on("connect", () => {
                resolve('connected');
            })
        })

        this.socket.removeAllListeners('connect');

        this.listeners();

        return res
    }

    disconnect() {
        this.socket.disconnect();
    }

    public async set(key: string, data: string) {
        this.socket.emit("set", {
            key,
            data
        });

        return key
     }

    public async get(key: string) {
        this.socket.emit("get", {
            key
        });

        return this.waitForResponse(key)
    }

    public async delete (key: string) {
        this.socket.emit("delete", {
            key
        });

        return key
    }

    private async waitForResponse(key: string) {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.lastResponses[key]) {
                    const data = this.lastResponses[key]

                    delete this.lastResponses[key];

                    clearInterval(interval);
                    resolve(data);
                }
            })
        })
    }

    private listeners() {
        this.socket.on("get", ({ key, data }: KeyValue) => {
            this.lastResponses[key] = data
        })

        this.socket.on("disconnect", () => {
            // console.log("disconnected");
        })
    }
}

export const WsMemoryStore = new WsMemoryStoreClient()