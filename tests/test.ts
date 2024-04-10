import WsMemoryStore from "../client";

const main = async () => {
    await WsMemoryStore.connect();

    const check = async (i: number) => {
        const key = await WsMemoryStore.set(`test:${i + 1}`, `foo:bar:${i + 1}`);
        const data = await WsMemoryStore.get(key);

        return {
            key,
            data
        }
    }

    const promises: any = [];

    for (let i = 0; i < 5000; i++) {
        promises.push(check(i));
    }

    const res = await Promise.all(promises);

    console.log('res', JSON.stringify(res, null, 2));

    WsMemoryStore.disconnect();
}

main();