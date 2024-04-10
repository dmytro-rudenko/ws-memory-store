import { io } from "socket.io-client";

class WsMemoryStore {
    socket: any
    lastResponses: {
        [key: string]: string 
    } = {}

    async connect({
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

    async set(key: string, data: string) {
        this.socket.emit("set", {
            key,
            data
        });

        return key
     }

    async get(key: string) {
        this.socket.emit("get", {
            key
        });

        return await this.waitForResponse(key)
    }

    async waitForResponse(key: string) {
        return new Promise((resolve) => {
            setInterval(() => {
                if (this.lastResponses[key]) {
                    resolve(this.lastResponses[key]);
                    delete this.lastResponses[key];
                }
            })
        })
    }

    listeners() {
        this.socket.on("set", (key: string) => {
            // console.log("listener set", key);
        })

        this.socket.on("get", ({ key, data }: { key: string, data: string }) => {
            // console.log("listener get", key, data);
            this.lastResponses[key] = data
        })

        this.socket.on("disconnect", () => {
            console.log("disconnected");
        })
    }
}


export default new WsMemoryStore()