import { RedisClientType, createClient } from "redis"
import { MessageToEngine } from "./types/to";
import { MessageFromOrderbook } from "./types";

export class RedisManager {
    private client: RedisClientType;
    private publisher: RedisClientType;
    private static instance: RedisManager;

    private constructor() {
        this.client = createClient();
        this.publisher = createClient();
        this.client.connect();
        this.publisher.connect();
    }

    public static getInstance() {
        if(!this.instance) {
            this.instance = new RedisManager();
        }

        return this.instance;
    }
    // to avoid parallel transactions execution
    public sendAndAwait(message: MessageToEngine) {
      return new Promise<MessageFromOrderbook>((resolve) => {
        const id = this.getRandomClientId();
        this.client.subscribe(id, (message) => {
            this.client.unsubscribe(id);
            resolve(JSON.parse(message))
        });
        this.publisher.lPush("message", JSON.stringify({clientId: id, message}));
      })
    } 

    public getRandomClientId() {
        return Math.random().toString(32).substring(2,15) + Math.random().toString(32).substring(2,15); 
    }
}