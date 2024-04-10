declare class WsMemoryStore {
    socket: any;
    lastResponses: {
        [key: string]: string;
    };
    connect({ host, port, http2 }?: {
        host?: string;
        port?: number;
        http2?: boolean;
    }): Promise<unknown>;
    disconnect(): void;
    set(key: string, data: string): Promise<string>;
    get(key: string): Promise<unknown>;
    waitForResponse(key: string): Promise<unknown>;
    listeners(): void;
}
declare const _default: WsMemoryStore;
export default _default;
