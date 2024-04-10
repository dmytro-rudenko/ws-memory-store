WS Memory Store
===============

WS Memory Store is an in-memory data store based on WebSockets. It allows you to store and retrieve data through a simple WebSocket interface. The module consists of a server part written in Node.js and a client library for interacting with the server.

Installation
------------

You can install the module using npm:

```
$ npm install -g ws-memory-store
```

Usage
-----

### Server

You can start the server using the `serve` command:

```
$ ws-memory-store serve -p 3000
```

Options:

- `-p`, `--port` - port for running the server (default: 22922)

The server will listen for incoming WebSocket connections and handle messages for storing, retrieving, and deleting data.

### Client Library

The `ws-memory-store` client library allows you to connect to the server and perform data storage and retrieval operations. The library supports both CommonJS modules and TypeScript.

#### Example usage with CommonJS

```javascript
const { WsMemoryStore } = require("ws-memory-store/client");

const main = async () => {
  await WsMemoryStore.connect();
  const key = await WsMemoryStore.set('foo', 'bar');
  const value = await WsMemoryStore.get(key);
  console.log({ key, value });
  WsMemoryStore.disconnect();
};

main();
```

#### Example usage with TypeScript

```typescript
import { WsMemoryStore } from "ws-memory-store/client";

const main = async () => {
  await WsMemoryStore.connect();
  const key = await WsMemoryStore.set('foo', 'bar');
  const value = await WsMemoryStore.get(key);
  console.log({ key, value });
  WsMemoryStore.disconnect();
};

main();
```

Client library methods:

- `connect({ host, port, http2 })` - establishes a connection with the server. Options:
  - `host` - server host (default: `localhost`)
  - `port` - server port (default: 22922)
  - `http2` - use HTTP2 protocol (default: `false`)
- `disconnect()` - closes the connection with the server
- `set(key, data)` - stores data by key
- `get(key)` - retrieves data by key
- `delete(key)` - deletes data by key

Help
----

To get help on using the utility, you can use the `help` command:

```
$ ws-memory-store help
```

This will display a description of the commands and options for running the server.
