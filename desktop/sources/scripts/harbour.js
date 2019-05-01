'use strict'
const { dialog, app } = require('electron').remote
const path = require('path')
const Tone = require('tone')
const tonePatch = require('tone-patch')
const _ = require('lodash')
const UdpListener = require('./udp/listener')

function Harbour () {
  this.controller = new Controller()

  this.install = function () {
    console.info('Harbour is installing..')
    this.listener = new UdpListener(this)

    // open a default patch
    const patchUrl = 'http://localhost:51051/0.js'
    let channel = new Tone.Channel().toMaster()
    tonePatch.createPatch(Tone, channel, patchUrl, (err, patch) => {
      if (err) return console.log(err)
      patch.start()
    })
    this.start()
  }
  this.start = function () {
    console.info('Harbour is starting..')
    const audioContext = Tone.Master.context
    Tone.start()
    Tone.Transport.start()
  }

  this.open = function () {

  }
}

module.exports = Harbour
