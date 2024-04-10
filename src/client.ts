import { io } from "socket.io-client";

class WsMemoryStoreClient {
    socket: any
    lastResponses: {
        [key: string]: string 
    } = {}
    static instance: WsMemoryStoreClient;

    public async connect({
        host = 'localhost',
        port = 22922,
        http2 = false
    }: {
        host?: string,
        port?: number,
        http2?: boolean
    } = {}) {
        this.socket = io(`${http2 ? 'https' : 'http'}://${host}:${port}`);

        const res = await new Promise((resolve) => {
            this.socket.on("connect", () => {
                this.listeners();
                resolve('connected');
                console.log("connected");
            })
        })

        this.socket.removeAllListeners('connect');

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

        return await this.waitForResponse(key)
    }

    public async delete (key: string) {
        this.socket.emit("delete", {
            key
        });

        return key
    }

    private async waitForResponse(key: string) {
        return new Promise((resolve) => {
            setInterval(() => {
                if (this.lastResponses[key]) {
                    resolve(this.lastResponses[key]);
                    delete this.lastResponses[key];
                }
            })
        })
    }

    private listeners() {
        this.socket.on("get", ({ key, data }: { key: string, data: string }) => {
            // console.log("listener get", key, data);
            this.lastResponses[key] = data
        })

        this.socket.on("disconnect", () => {
            console.log("disconnected");
        })
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new WsMemoryStoreClient();
        }
        return this.instance
    }
}

export const WsMemoryStore = WsMemoryStoreClient.getInstance()