import { TextureLoader } from 'THREE'
import flatten from 'lodash/flatten'

import { assetsConfig } from '@game/config'

import { storeAssetsLoader } from '@shared/stores'

export default class AssetsLoader {
  private readonly assets: string[] = []

  constructor() {
    this.assets = flatten(assetsConfig)
    console.log('-------------')
    console.log(assetsConfig)
    console.log(this.assets)
  }

  async loadAssets() {
    // set max assets count in store
    storeAssetsLoader.setMax(this.assets.length)
    // start loading all assets
    await this.loadAll()
  }

  private async loadAll() {
    for (const asset of this.assets) {
      await this.load(asset.url)
      storeAssetsLoader.incrementProgress()
    }
  }

  private load(assetUrl: string) {
    return new Promise((resolve) => {
      const loader = new TextureLoader()
      loader.load('../resources/textures/blocks/sky_01.png', (texture) => {
        resolve(texture)
      })
    })
  }
}
