import dat, { GUI } from 'dat.gui'

import Space from './space'

export class Dat {
  private gui: GUI
  private folders: { [key: string]: GUI } = {}

  constructor() {
    this.gui = new dat.GUI()
    this.gui.close()
  }

  createSpace(name: string, targetContext: unknown) {
    this.ensureFolder(name)
    return new Space(this, this.folders[name], targetContext)
  }

  private ensureFolder(folder: string) {
    if (typeof this.folders[folder] === 'undefined') {
      this.folders[folder] = this.gui.addFolder(folder)
      this.folders[folder].open()
    }
  }

  add(folder: string, label, { data, opts }, cb) {
    this.ensureFolder(folder)
    this.folders[folder].add(data, label, ...opts).onChange(cb)
  }

  addColor(folder, label, { data, opts }, cb) {
    this.ensureFolder(folder)
    this.folders[folder].addColor(data, label, ...opts).onChange(cb)
  }

  addTo(folder) {
    this.ensureFolder(folder)
    return this.folder[follder]
  }
}

export default new Dat()
