import { isDefined } from './_is-defined'

class _Perf {
  timeStart
  timeEnd
  name

  constructor(name) {
    this.name = name
    this.timeStart = new Date().getTime()
  }

  fillSpace(textBefore) {
    let fillText = ''
    for (let i = 30 - textBefore.length; i; i--) fillText += ' '
    return fillText
  }

  end() {
    this.timeEnd = new Date().getTime()
    console.log(
      `%c ${this.name} ${this.fillSpace(this.name)} [${(this.timeEnd - this.timeStart) / 1000}s]`,
      'color: blue; font-size: 12px; background: #f1f1f1; padding: 1px 5px;',
    )
  }
}

/**
 * Perf
 * proxy class to handle perf instances by name
 * @static
 */
export class Perf {
  static instances = {}

  static get(name) {
    if (!isDefined(Perf.instances[name])) {
      Perf.instances[name] = new _Perf(name)
    }
    return Perf.instances[name]
  }
}
