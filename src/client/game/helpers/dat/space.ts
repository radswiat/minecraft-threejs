import { Math as ThreeMath } from 'three'
import { GUI } from 'dat.gui'
import { Color } from 'THREE'

import get from 'lodash/get'
import set from 'lodash/set'

import { Dat } from './dat'

import { AddOpts, TargetContextThree, ConverterTypes, RgbaColor } from './space.types'

const valueConverters = {
  default: {
    get: (val: number) => val,
    set: (val: number) => val,
  },
  deg: {
    get: (val: number) => ThreeMath.radToDeg(val),
    set: (val: number) => ThreeMath.degToRad(val),
  },
}

export default class DatSpace {
  private context: Dat = null
  private space: GUI = null
  private readonly targetContext: TargetContextThree = null
  private onChangeFn: Function = null

  constructor(context: Dat, space: GUI, targetContext: TargetContextThree) {
    this.context = context
    this.space = space
    this.targetContext = targetContext
  }

  add(key: string, { range, opts, convert = 'default' }: AddOpts) {
    if (range) {
      const value = get(this.targetContext, key)
      opts = [-(-value + range), (-value - range) * -1, ...opts]
    }
    const data = { [key]: valueConverters[convert].get(get(this.targetContext, key)) }
    this.space.add(data, key, ...opts).onChange(this.handleOnChange.bind(this, key, convert))
  }

  addColor(key: string) {
    const data = { [key]: get(this.targetContext, key) }
    this.space.addColor(data, key).onChange(this.handleOnChangeColor.bind(this, key))
  }

  handleOnChange = (key: string, converter: ConverterTypes, val: number) => {
    set(this.targetContext, key, valueConverters[converter].set(val))
    if (this.onChangeFn) this.onChangeFn()
  }

  handleOnChangeColor = (key: string, val: RgbaColor) => {
    set(this.targetContext, key, new Color(`rgb(${Math.round(val.r)}, ${Math.round(val.g)}, ${Math.round(val.b)})`))
    if (this.onChangeFn) this.onChangeFn()
  }

  onChange(fn: Function) {
    this.onChangeFn = fn
  }
}
