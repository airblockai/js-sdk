import { Event, EventCallback, Result } from '@airblock-sdk/types'
import { Destination, buildResult } from '@core/destination.js'

export class Timeline {
  queue: [Event, EventCallback][] = []

  push(event: Event) {
    return new Promise<Result>(resolve => {
      this.queue.push([event, resolve])
      console.log('Pushed', [event])
      this.scheduleApply(0)
    })
  }

  scheduleApply(timeout: number) {
    console.log('Schedule Apply')
    setTimeout(async () => {
      const destination = new Destination()

      const item: [Event, EventCallback] = this.queue.shift() as [
        Event,
        EventCallback
      ]

      const [event] = item
      const [, resolve] = item

      const eventClone = { ...event }

      await destination
        .execute(eventClone)
        .catch((e: any) => buildResult(eventClone, 0, String(e)))

      if (this.queue.length > 0) {
        this.scheduleApply(0)
      }
    }, timeout)
  }

  async flush() {
    const queue = this.queue
    this.queue = []
  }
}
