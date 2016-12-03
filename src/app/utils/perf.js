var instances = {};


class _Perf {

  timeStart;
  timeEnd;
  name;

  constructor(name) {
    this.name = name;
    this.timeStart = new Date().getTime();
  }

  end() {
    this.timeEnd = new Date().getTime();
    console.log(`%c ${this.name} in ${(this.timeEnd - this.timeStart) / 1000}s`, 'color: blue; font-size: 12px; background: #95D7FF; padding: 1px 5px;');
  }
}

export default class Perf {

  constructor(name) {

  }

  static get(name) {
    if( typeof instances[name] === 'undefined') {
      instances[name] = new _Perf(name);
    }

    return instances[name];
  }

}