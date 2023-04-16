import { Event, Result } from '@airblock-sdk/types'
import { Destination, buildResult } from '@core/destination.js'

export class Timeline {
  queue: Event[] = []

  push(event: Event) {
    return new Promise<Result>(() => {
      this.queue.push(event)
      console.log('Pushed', event)
      this.scheduleApply()
    })
  }

  async scheduleApply() {
    console.log('Schedule Apply')
    const destination = new Destination()

    const item: Event = this.queue.shift() as Event

    console.log('Event Clone', item)

    await destination
      .execute(item)
      .catch((e: any) => buildResult(item, 0, String(e)))

    if (this.queue.length > 0) {
      console.log('If Statement Ran')
      this.scheduleApply()
    }
  }

  async flush() {
    const queue = this.queue
    this.queue = []

    const destination = new Destination()

    await destination.flush()
  }
}
