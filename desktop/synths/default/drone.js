exports.about = {
  autostart: true,
  tuningKnobs: 3
}

exports.init = (Tone, destination, { baseUrl }, done) => {
  Promise.all([
    bounceChord(['A#6', 'F7', 'A#7', 'D#8', 'F8'], 3, 3),
    bounceChord(['D#5', 'A#5', 'C6', 'G6', 'A#6', 'C9'], 3, 3),
    bounceChord(['F6', 'C6', 'D#7', 'A#7', 'C8'], 3, 3),
    bounceChord(['A#5', 'D#6', 'G6', 'C7', 'D#7', 'G8'], 3, 3)
  ]).then(buffers => {
    let patternCtrl = new Tone.CtrlPattern([0, 1, 2, 3], 'random')
    let timeCtrl = new Tone.CtrlRandom(6, 18)
    function next (time) {
      let buffer = buffers[patternCtrl.next()]
      new Tone.BufferSource({ buffer, playbackRate: 0.125 }).connect(destination)
      Tone.Transport.scheduleOnce(next, "+" + timeCtrl.value)
    }
    next(Tone.now())
  })
}

exports.start = () => {
 // ?
}


function bounceChord(notes, playDuration, tailDuration, destination) {
  let playSeconds = Tone.Time(playDuration).toSeconds()
  let tailSeconds = Tone.Time(tailDuration).toSeconds()
  return Tone.Offline(() => {
    let reverb = new Tone.Reverb({ decay: playSeconds / 4, wet: 0.8 })
    reverb.generate()
    let synth = new Tone.PolySynth(notes.length, Tone.FMSynth).chain(
      new Tone.Chorus({ frequency: 0.33, depth: 0.7, wet: 0.85 }),
      new Tone.FeedbackDelay({
        delayTime: playSeconds / 16,
        feedback: 0.33,
        wet: 0.66
      }),
      reverb,
      destination
    )
    synth.set({
      hamonicity: 0.5,
      modulationIndex: 1,
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: playSeconds / 4,
        sustain: 1,
        release: tailSeconds - 1,
        attackCurve: 'linear',
        releaseCurve: 'linear'
      },
      modulation: { type: 'sine' },
      modulationEnvelope: {
        attack: playSeconds * 2,
        sustain: 1,
        release: tailSeconds,
        releaseCurve: 'linear'
      },
      volume: -30
    })
    synth.triggerAttackRelease(notes, playSeconds)
  }, playSeconds + tailSeconds)
}
