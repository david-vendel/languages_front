/* @flow */

const VERSION = 1;
const DB_NAME = "justdvl";
const STORES =     {
    name: 'service.ui/table-info',
    id: 'table',
    typeOfId: 'string'
};
const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// each time new store is added/deleted, VERSION needs to be increased

let instance = null;

class IndexedDb {
    setDb(db) {
        this.db = db;
    }

    static getInstance(): IndexedDb {
        if(!instance) {
            instance    = new IndexedDb();
            this.isOpen = false;
        }

        return instance;
    }

    async connect() {
        await new Promise(
            (resolve, reject) => {
                if(!this.isOpen) {
                    const dbRequest   = indexedDB.open(DB_NAME, VERSION);
                    dbRequest.onerror = event => {
                        console.warn("IndexedDB failed.", event);
                        reject(Error("IndexedDB database error"));
                    };
                    dbRequest.onupgradeneeded = (event: Event & { target: { result: IDBDatabase } }) => {
                        const database = event.target.result;
                        STORES.forEach(store => {
                            if (!database.objectStoreNames.contains(store.name)) {
                                database.createObjectStore(store.name, { keyPath: store.id });
                            }
                        });
                    };

                    dbRequest.onsuccess = (event: Event & { target: { result: IDBDatabase } }) => {
                        this.setDb(event.target.result);
                        this.isOpen = true;
                        resolve("Database opened");
                    };
                } else {
                    resolve("Database has been opened before");
                }

            }
        );
    }

    getObjectStore(storeName, rights: 'readwrite' | null) {
        let currentRights = rights;
        let transaction   = null;
        if(!currentRights) {
            try {
                transaction = this.db.transaction([storeName]);
            } catch(err) {
                console.warn("IndexedDb-getObjectStore error", storeName, err);
            }
        } else {
            transaction = this.db.transaction([storeName], currentRights);
        }

        return transaction && transaction.objectStore(storeName);
    }

    async put(storeName, objectId , object) {
        await this.connect();
        await new Promise(
            (resolve, reject) => {
                const objectStore   = this.getObjectStore(storeName, 'readwrite');
                const objectRequest = objectStore.put(object.entity); // Overwrite if exists
                objectRequest.onerror = (event) => {
                    console.warn("IndexedDB:put() failed.", storeName, object, event);
                    reject(Error('Cannot put this entity to database.'));
                };

                objectRequest.onsuccess = (event) => {
                    resolve('Data saved OK', event);
                };
            }
        );
    };

    async get(storeName, objectId) {
        await this.connect();
        return await new Promise(
            (resolve, reject) => {
                const objectStore = this.getObjectStore(storeName);
                if(objectStore === null) {
                    return;
                }
                const objectRequest = objectStore.get(objectId);

                objectRequest.onerror = (event: Event) => {
                    console.warn("IndexedDB:get() failed.", storeName, objectId, event);
                    reject(undefined);
                };

                objectRequest.onsuccess = (event: Event & { target: { result: Object } }) => {
                    resolve(event.target.result);
                };
            }
        );
    }

    async getAll(storeName: string): Promise {
        await this.connect();
        return await new Promise(
            (resolve, reject) => {
                const objectStore   = this.getObjectStore(storeName);
                const objectRequest = objectStore.getAll();

                objectRequest.onerror = (event: Event) => {
                    console.warn("IndexedDB:getAll() failed.", storeName, event);
                    reject(undefined);
                };

                objectRequest.onsuccess = (event: Event & { target: { result: Array<Object> } }) => {
                    resolve(event.target.result);
                };
            }
        );
    }

    async getAllKeys(storeName: string): Promise {
        await this.connect();
        return await new Promise(
            (resolve, reject) => {
                const objectStore   = this.getObjectStore(storeName);
                const objectRequest = objectStore.getAllKeys();

                objectRequest.onerror = (event: Event) => {
                    console.warn("IndexedDB failed.", event);
                    reject(undefined);
                };

                objectRequest.onsuccess = (event: Event & { target: { result: Array<Object> }}) => {
                    resolve(event.target.result);
                };
            }
        );
    }

    async removeAllEntriesByKey(storeName, id, {client, response, keyToDelete}): Promise {
        let keysToRemove = response.filter(key => {
            return key.toString().includes(keyToDelete)
        });

        for (let i = 0; i < keysToRemove.length; i++){
            const key = keysToRemove[i];
            const request = client.createRequest(`remove/${key}`);
            try {
                await client.query(request);
            } catch (err) {
                console.error("Cannot remove entry with key: ", keyToDelete, err);
            }
        }
    }


    async remove(storeName: string, objectId: number | string): Promise {
        await this.connect();
        return await new Promise(
            (resolve, reject) => {
                const objectStore   = this.getObjectStore(storeName, "readwrite");
                const objectRequest = objectStore.delete(objectId);
                objectRequest.onerror = (event: Event) => {
                    console.warn("IndexedDB:remove() failed.", storeName, objectId, event);
                    reject(undefined);
                };

                objectRequest.onsuccess = (event: Event) => {
                    resolve('Data removed OK', event);
                };
            }
        );
    }

    async removeAll(storeName: string): Promise {
        await this.connect();
        return await new Promise(
            (resolve, reject) => {
                const objectStore   = this.getObjectStore(storeName);
                const objectRequest = objectStore.clear();

                objectRequest.onerror = (event: Event) => {
                    console.warn("IndexedDB:removeAll() failed.", storeName, event);
                    reject(undefined);
                };

                objectRequest.onsuccess = (event: Event) => {
                    resolve('All data removed OK', event);
                };
            }
        );
    }

    closeDatabase(): void {
        this.db.close();
        this.isOpen = false;
        this.db     = null;
    }
}

export default IndexedDb;
