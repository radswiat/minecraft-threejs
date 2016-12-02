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
    console.log(`${(this.timeEnd - this.timeStart) / 1000}s`);
  }
}

export default class Perf {

  constructor(name) {

  }

  static get(name) {
    if( typeof instances[name] === 'undefined') {
      instances[name] = new _Perf();
    }

    return instances[name];
  }

}