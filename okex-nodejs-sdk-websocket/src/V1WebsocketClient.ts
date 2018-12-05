import {EventEmitter} from "events";
import WebSocket = require('ws');
import {legacyProductId} from "./util";
import pako = require("pako");

export class V1WebsocketClient extends EventEmitter {
    private websocketUri: string;
    private socket?: WebSocket;

    constructor(
        websocketURI = 'wss://real.okex.com:10441/ws/v1'
    ) {
        super();
        this.websocketUri = websocketURI
    }

    connect() {
        if (this.socket) {
            this.socket.close();
        }

        this.socket = new WebSocket(this.websocketUri);
        console.log(`Connecting to ${this.websocketUri}`);

        this.socket.on('open', () => this.onOpen());
        this.socket.on('close', (code, reason) => this.onClose(code, reason))
        this.socket.on('message', data => this.onMessage(data))
    }

    private send(messageObject: any) {
        if (!this.socket) throw Error('socket is not open');
        this.socket.send(JSON.stringify(messageObject))

    }

    private onOpen() {
        console.log(`Connected to ${this.websocketUri}`);
        const interval = setInterval(() => {
            this.send({event: "ping"});
        }, 5000);
        this.socket!.on('close', () => clearInterval(interval));
        this.emit('open');
    }

    private onMessage(data: WebSocket.Data) {
        if (data instanceof String) {
            this.emit('message', data)
        } else {
            this.emit('message', pako.inflateRaw(data as any, {to: 'string'}))
        }
    }

    private onClose(code: number, reason: string) {
        console.log(`Websocket connection is closed.code=${code},reason=${reason}`);
        this.socket = undefined;
        this.emit('close');
    }

    subscribeSpotDepth(instrument_id: string) {
        const productId = legacyProductId(instrument_id);
        this.send({event: "addChannel", channel: `ok_sub_spot_${productId}_depth`})
    }

    subscribeSpotDeals(instrument_id: string) {
        const productId = legacyProductId(instrument_id);
        this.send({event: "addChannel", channel: `ok_sub_spot_${productId}_deals`})
    }

    close() {
        if (this.socket) {
            console.log(`Closing websocket connection...`);
            this.socket.close();
            this.socket = undefined;
        }
    }

}