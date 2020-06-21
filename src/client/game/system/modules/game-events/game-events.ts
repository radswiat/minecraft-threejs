export default new (class GameEvents {
  eventsArgs: { [key: string]: unknown } = {}
  events: { [key: string]: Function[] } = {}

  register(eventType: string, fn: Function) {
    if (typeof this.events[eventType] === 'undefined') this.events[eventType] = []
    this.events[eventType].push(fn)
  }

  trigger(eventType: string) {
    if (!this.events[eventType]) return
    const args = this.eventsArgs[eventType]
    this.events[eventType].forEach((fn) => fn(...args))
  }

  addArgs(eventType, args) {
    if (!this.eventsArgs[eventType]) this.eventsArgs[eventType] = []
    this.eventsArgs[eventType].push(...args)
  }
})()
