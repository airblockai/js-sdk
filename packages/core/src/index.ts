/////////////////////////////////////////////////////////////////////////////////
/* 
  Works similarly to amplitude-typescript

  Source : https://github.com/amplitude/Amplitude-TypeScript 
  MIT License
  Copyright (c) 2022 Amplitude Analytics
*/

/////////////////////////////////////////////////////////////////////////////////

import { AirblockBrowser } from '@core/browser-client.js'

const client = new AirblockBrowser()

const init = client.init.bind(client)
const track = client.track.bind(client)
const flush = client.flush.bind(client)

export { init, track, flush }
