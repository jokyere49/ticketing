import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper{
    private _client?: Stan; //_client? tells typescript this property may not be defined for awhile #329

    // throws an error if client is not already connected
    // this is ts getter method
    get client() {
        if (!this._client){
            throw new Error('Cannot access NATS client before connecting');
        }

        return this._client;
    }

    connect(clusterId: string, clientId: string, url:string) {
        this._client = nats.connect(clusterId, clientId, {url});
        
        return new Promise<void>((resolve, reject) =>  {
            this.client.on('connect', ()=> {
            console.log('connected to Nats !!!!');
            resolve();
            });
            this.client.on('error', (err) => {
                reject(err);
            });
        });
    }

}

export const natsWrapper = new NatsWrapper();