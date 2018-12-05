import axios, {AxiosInstance} from 'axios'
import Instrument from './domain/spot/Instrument'

export class V3PublicClient {
    private axios: AxiosInstance;



    constructor(apiUri = 'https://www.okex.com/', axiosConfig = {}) {
        this.axios = axios.create({
            baseURL: apiUri,
            ...axiosConfig,
        });
    }

    async getSpotInstruments(): Promise<Array<Instrument>> {
        return this.axios.get('/api/spot/v3/instruments')
            .then(res => res.data)
    }

    async getSwapInstruments(): Promise<Array<Instrument>> {
        return this.axios.get('/api/swap/v3/instruments')
            .then(res => res.data)
    }
}