export type TargetContextThree = {[key: string]: number}

export type ConverterTypes = 'default' | 'deg'

export interface RgbaColor {
  r: number;
  g: number;
  b: number;
}

export interface AddOpts {
  range?: number;
  opts: number[];
  convert?: ConverterTypes;
}
