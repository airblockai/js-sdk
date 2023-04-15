import { AirblockBrowser } from '@core/browser-client.js'

const client = new AirblockBrowser()

const init = client.init.bind(client)
const track = client.track.bind(client)

export { init, track }
