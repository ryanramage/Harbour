import Vue from 'vue'
import VueNumericInput from 'vue-numeric-input';
import WebMidi from 'webmidi'
const tonePatch = require('tone-patch')
const Tone = require('tone')
const Theme = require('./theme')
const Row = require('./lib/row')

Vue.component('vue-numeric-input', VueNumericInput)
WebMidi.enable(err => {

  Tone.start()
  Tone.Transport.start()
  let initialRows = []
  // load the patch array from the hash
  if (window.location.hash) {
    try {
      let _decoded = JSON.parse(decodeURIComponent(window.location.hash.substring(1)))
      initialRows = _decoded.map(d => new Row(WebMidi, Tone, d))

    } catch (e) {
      console.log('could not load', e)
    }
  }


  var app = new Vue({
    el: '#app',
    data: {
      patchUrl: 'http://localhost:51051/1.js',
      selected: WebMidi.inputs[0].id,
      channel: 'All',
      port: WebMidi.inputs.map((input, i) => ({ text: input.name, value: input.id })),
      rows: initialRows
    },
    methods: {
      addPatch: function () {
        let about = {}
        let patchUrl = new String(this.patchUrl).toString()
        let channel = (this.channel === 'All') ? 'all' : Number(this.channel);
        let inputId = new String(this.selected).toString()
        let mute = false
        let solo = false
        this.rows.push(new Row(WebMidi, Tone, {patchUrl, channel, inputId, mute, solo}))
        this.urlHash()
      },
      urlHash: function () {
        console.log('hash it', )
        let rows = this.$data.rows.map(r => r.export())
        let hash = encodeURIComponent(JSON.stringify(rows))
        window.location.hash = hash
      }
    }
  })
}, true)

let theme = new Theme({ background: '#000000', f_high: '#ffffff', f_med: '#777777', f_low: '#444444', f_inv: '#000000', b_high: '#eeeeee', b_med: '#72dec2', b_low: '#444444', b_inv: '#ffb545' });
theme.install(document.body);
theme.start();
