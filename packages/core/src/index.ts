/////////////////////////////////////////////////////////////////////////////////
/* 
  Works similarly to amplitude-typescript

  Source : https://github.com/amplitude/Amplitude-TypeScript 
  MIT License
  Copyright (c) 2022 Amplitude Analytics
*/

/////////////////////////////////////////////////////////////////////////////////

import { Metamask } from '../../wallets/metamask/src/metamask.js'
import { AirblockBrowser } from './browser-client.js'

const client = new AirblockBrowser()
const metamask = new Metamask(client)

const init = client.init.bind(client)
const track = client.track.bind(client)
const flush = client.flush.bind(client)

const metamask_error = metamask.error.bind(metamask)

export { init, track, flush, metamask_error }
