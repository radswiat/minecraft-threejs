import { observable, action, configure } from 'mobx'

configure({
  enforceActions: true,
})

/**
 * Game loader store
 */
export default new (class GameLoaderStore {
  // Is game fully loaded
  // And no more things would be loading
  @observable isGameLoaded = false

  // Current task title
  // Only one task allowed at the time
  @observable taskTitle = null

  // Current task progress
  @observable taskCurrent = 0

  // Current task max
  @observable taskMax = 0

  @action setNewTask(title, { max }) {
    this.taskTitle = title
    this.taskMax = max
    this.taskCurrent = 0
  }

  @action setTaskFinished() {
    this.taskCurrent = this.taskMax
  }

  @action setCurrent(value) {
    this.taskCurrent = value
  }

  @action reset() {
    // this.title = ''
    // this.max = 0
    // this.progress = 0
  }

  @action setTitle(title) {
    // this.reset()
    // this.title = title
  }

  @action setMax(max) {
    // this.max = max
  }

  @action increment() {
    this.taskCurrent++
  }

  @action setLoading(value) {
    // this.isLoading = !!value
  }
})()
