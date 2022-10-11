import NodeGeocoder from 'node-geocoder';
import dotenv from 'dotenv';

dotenv.config();

const options: NodeGeocoder.Options = {
    provider: process.env.GEOCODER_PROVIDER as any,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}

const geocoder = NodeGeocoder(options);

export default geocoder;