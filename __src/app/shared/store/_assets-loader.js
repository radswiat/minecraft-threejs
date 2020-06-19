import { observable, action, configure } from 'mobx';

configure({
  enforceActions: true,
});

/**
 * Demo of MobX store
 */
export default new class AssetsLoader {

  // make type observable
  // component will be updated when it will change
  @observable progress = 0;
  @observable max = 0;
  @observable isLoading = false;

  @action reset() {
    this.title = '';
    this.max = 0;
    this.progress = 0;
  }

  @action setTitle(title) {
    this.reset();
    this.title = title;
  }

  @action setMax(max) {
    this.max = max;
  }

  @action incrementProgress() {
    this.progress++;
  }

  @action setLoading(value) {
    this.isLoading = !!value;
  }

};
