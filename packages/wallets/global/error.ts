import { BrowserClient } from '../../types/src/index.js'

async function error(err: any, event_name: string, client: BrowserClient) {
  client?.track(
    event_name,
    {
      ...err
    },
    undefined,
    undefined
  )
}

export { error }
