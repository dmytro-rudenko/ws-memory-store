declare class WsMemoryStoreClient {
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
    delete(key: string): Promise<string>;
    private waitForResponse;
    private listeners;
}
export declare const WsMemoryStore: WsMemoryStoreClient;
export {};
