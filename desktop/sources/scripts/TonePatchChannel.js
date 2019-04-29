
class TonePatchChannel extends Channel {
  constructor (script) {
    this.script = script()
  }
  
  start () {
    this.script.start()
  }

  stop () {
    this.script.stop()
  }

  dispose () {
    if (this.script.dispose) this.script.dispose()
  }

}
module.exports = TonePatchChannel
