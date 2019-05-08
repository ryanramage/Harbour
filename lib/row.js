const tonePatch = require('tone-patch')

module.exports = Row

function Row (WebMidi, Tone, {patchUrl, inputId, channel, mute, solo}) {
  this.about = {patchUrl, inputId, channel}
  this.name = patchUrl
  this.channelName = (channel === 'all') ? 'all' : channel - 1
  this.channel = new Tone.Channel().toMaster()
  this.channel.mute = mute
  this.channel.solo = solo

  tonePatch.createPatch(Tone, this.channel, patchUrl, (err, patch) => {
    if (err) return console.log(err)

    this.patch = patch
    this.name = patch.info.name || patchUrl
    console.log(patch)
    if (patch.start) patch.start()
    this.connect(WebMidi)

  })
}

Row.prototype.connect = function (WebMidi) {
  this.input = WebMidi.getInputById(this.about.inputId)
  console.log(this.name, this.input)
  if (this.input) {

    const triggerAttack = e => this.patch.triggerAttack(`${e.note.name}${e.note.octave}`, e.velocity)
    const triggerRelease = e => this.patch.triggerRelease(`${e.note.name}${e.note.octave}`, e.velocity)
    this.input.addListener('noteon', this.about.channel, triggerAttack)
    this.input.addListener('noteoff', this.about.channel, triggerRelease)
    this.input.addListener('start', this.about.channel, () => console.log('start'))
    this.input.addListener('stop', this.about.channel, () => console.log('stop'))
    this.input.addListener('clock', this.about.channel, () => console.log('clock'))
    this.input.addListener('controlchange', this.about.channel, e => console.log(e))
  }
};

Row.prototype.export = function () {
  return {
    ...this.about,
    mute: this.channel.mute,
    solo: this.channel.solo,
  }
}
