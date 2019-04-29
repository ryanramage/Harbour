module.exports = Channel
const _ = require('lodash')
const convert = require('./lib/convert')
const Joi = require('joi-browser')

class Channel {
  constructor ({channel, tuningKnobs}) {
    this.channel = channel
    this.tuningKnobs
  }

  mute (shouldMute) {
    this.channel.mute = shouldMute
  }

  solo (shouldSolo) {
    this.channel.solo = true
  }

  volume (normalRange) {
    this.channel.volume.value = convert.interpolate(normalRange, -80, 6)
  }

  pan (normalRange) {
    this.channel.pan.value = convert.interpolate(normalRange, -1, 1)
  }

  getTuningKnobs () {
    return this.tuningKnobs
  };

  dispose () {
    this.channel.disconnect()
    this.channel.dispose()
  }
}

module.exports = Channel
