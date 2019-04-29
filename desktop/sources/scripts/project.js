'use strict'
const fs = require('fs')
const path = require('path')
const fileUrl = require('file-url')
const chokidar = require('chokidar')
const EventEmitter = require('events')
class ProjectEmitter extends EventEmitter {}
const loader = require('./loader')


// create up to 36 channels from each file in a dir.
module.exports = function (dir) {
  const project = new Project(dir)
  return project
}

function Project (dir) {
  this.dir = dir
  this.baseUrl = fileUrl(this.dir) + '/'
  this.emitter = new ProjectEmitter()
  this.watcher = chokidar.watch(dir).on('all', (event, path) => {
    // read
    // loadFiles
    // dispose old
    // connect
    // emit project changed event
  })
  this._read = function () {
    this.about = loader.read(dir)
  }

  this._loadFiles = function () {
    if (this.about.manifest) this.manifest = loader.manifest(this.about.manifest)
    this.channels = loader.loadChannels(this.about.channels)
  }
  
  this._dispose = function () {
    this.channels.forEach(channel => channel.dispose())
  }

  this._connect = function () {
    // create new channels
    this.channels = channelDefns.map(c => create(c, this.baseUrl))
  }



}

Project.prototype.save = function () {
  // save back changes that were made in the ui?
}


Project.prototype.getChannel = function (channel) {
  return this.channels[channel]
}
