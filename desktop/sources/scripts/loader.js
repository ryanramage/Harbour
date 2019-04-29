'use strict'
const Tone = require('tone')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const manifestSchema = require('./lib/types/manifest')
const scriptSchema = require('./lib/types/script')

// create up to 36 channels from each file in a dir.

exports.read = function (dir) {
  const files = fs.readdirSync(dir)
  let interestingFiles = files.filter(f => {
    if (f.endsWith('.json')) return true
    if (f.endsWith('.js')) return true
  })
  let about = {
    manifest: null,
    channels: []
  }
  if (_.includes(jsonFiles, 'manifest.json')) {
    interestingFiles = _.reject(interestingFiles, f => f.indexOf('manifest.json') === 0)
    let fullPath = path.resolve(dir, 'manifest.json')
    about.manifest = fullPath
  }
  about.channel = interestingFiles.sort().map(f => {
    let fullPath = path.resolve(dir, f)
    let type = (f.endsWith('.json')) ? 'json' : 'js'
    return {type, fullPath}
  })
  return about
}

exports.loadManifest = function (fullPath) {
  delete require.cache[fullPath]
  try {
    let manifet =  require(fullPath)
    manifestSchema.validate(manifest)
    return manifest
  } catch (e) {
    console.log('could not open manifest', fullPath, e)
    return null
  }
}

exports.loadChannels = function (channels) {
  return channels.map(c => {
    if (c.type === 'json') return exports.loadChannelJson(c)
    if (c.type === 'js') return exports.loadChannelJavascript(c)
  })
}

exports.loadChannelJson = function (channel) {
  let fullPath = channel.fullPath
  delete require.cache[fullPath]
  try {
    channel.channelDefn = return require(fullPath)
    // should validate schema like the rest
    return channel
  } catch (e) {
    console.log('could not open json', fullPath, e)
    return null
  }
}

exports.loadChannelJavascript = function (channel) {
  let fullPath = channel.fullPath
  delete require.cache[fullPath]
  try {
    channel.script = require(fullPath)
    scriptSchema.validate(channel.script)
    return channel
  } catch (e) {
    console.log('could not open javascript', fullPath, e)
    return null
  }
}


//
// module.exports = function (dir) {
//   const files = fs.readdirSync(dir)
//   let manifest = {
//     viz: ['Flexi, martin + geiss - dedicated to the sherwin maxawow']
//   }
//   let jsonFiles = files.filter(f => {
//     if (f.endsWith('.json')) return true
//     if (f.endsWith('.js')) return true
//   })
//
//   // delete from require.cache
//   // var chokidar = require('chokidar');
//
//   if (_.includes(jsonFiles, 'manifest.json')) {
//     jsonFiles = _.reject(jsonFiles, f => f.indexOf('manifest.json') === 0)
//     let fullPath = path.resolve(dir, 'manifest.json')
//     try {
//       manifest = require(fullPath)
//       // let toneSnipets = _.get(manifest, 'toneSnipets', [])
//       // toneSnipets.forEach(s => {
//       //   let fullPath = path.resolve(dir, s.script) // TODO security!
//       //   console.log('loading snippet', fullPath)
//       //   try {
//       //     let script = require(fullPath)
//       //     let destination = new Tone.Channel().toMaster()
//       //     let baseUrl = 'tbd'
//       //     script.init(Tone, destination, { baseUrl }, () => {})
//       //   } catch (e) { console.log(e) }
//       // })
//     } catch (e) {
//       console.log('could not open, skipping', fullPath, e)
//     }
//   }
//
//   const channels = jsonFiles.sort().map(f => {
//     let fullPath = path.resolve(dir, f)
//     try { return require(fullPath) } catch (e) {
//       console.log('could not open, skipping', fullPath, e)
//     }
//   }).filter(synth => synth) // remove any skipped
//   return {channels, manifest}
// }
