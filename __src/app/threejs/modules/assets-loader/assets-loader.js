import { TextureLoader } from 'three';

import { assetsConfig } from 'config';

import { storeAssetsLoader } from 'shared/store';

export default class AssetsLoader {

  static flattenAssets(assets) {
    const flatAssets = [];
    for (const [assetsGroup, assetsEntries] of Object.entries(assets)) {
      for (const [assetName, assetUrl] of Object.entries(assetsEntries)) {
        flatAssets.push({
          group: assetsGroup,
          name: assetName,
          url: assetUrl,
        });
      }
    }
    return flatAssets;
  }

  constructor() {
    // flatten nested assets object into array
    this.assets = AssetsLoader.flattenAssets(assetsConfig);
  }

  async loadAssets() {
    // set max assets count in store
    storeAssetsLoader.setTitle('Loading assets');
    storeAssetsLoader.setMax(this.assets.length);
    // start loading all assets
    await this._loadAll();
  }

  async _loadAll() {

    for (const asset of this.assets) {
      await this._load(asset.url);
      storeAssetsLoader.incrementProgress();
    }

    // Object.entries(assetsConfig).map(([assetsGroup, assetsEntries]) => {
    //   const texture = new TextureLoader().load('../assets/textures/blocks/sky_01.png');
    //   console.log(texture);
    // });
  }

  _load(assetUrl) {
    return new Promise((resolve) => {
      const loader = new TextureLoader();
      loader.load('../assets/textures/blocks/sky_01.png', (texture) => {
        resolve(texture);
      });
    });
  }

}
