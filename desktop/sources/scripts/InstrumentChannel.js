const _ = require('lodash')
const Channel = require('./channel')
const Instruments = require('./lib/types/instruments')

class IntrumentChannel extends Channel {
  constructor (details) {
    super(details)
    {type, synth, effects} = details
    this.type = type
    this.synth = synth
    this.effects = effects
  }

  describe () {
    let schema = Instruments[this.type]
    if (!schema) return null
    return schema
  }

  set (property, value) {
    let prop = _.get(this.synth, property)
    if (prop.value) prop.value = value
    else _.set(this.synth, property, value)
  }

  getEffect (index) {
    return this.effects[index]
  }

  play (octave, note, velocity, duration) {
    let synth = this.synth
    if (!synth._players) return synth.triggerAttackRelease(`${note}${octave}`, duration, '+0', velocity)

    // special case of a Tone.Players instance
    let player = synth.get(`${octave}${note}`)
    if (!player) return console.log('no player defined for note', note)
    player.start()
  }
}

module.exports = IntrumentChannel
