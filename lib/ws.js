/* global WebSocket */
var EventEmitter = require('eventemitter2').EventEmitter2
var Q = require('q')

var Webmo = function Webmo (host) {
  host = host || 'webmo.local'

  this.host = host
  this.stepDegree = 1.8
  this.onmessage = null
  this._ws = new WebSocket('ws://' + host + ':8080/')
  this._ev = new EventEmitter()

  this._ws.onopen = function (e) {
    if (typeof (this.onopen) === 'function') {
      this.onopen(e)
    }
    this._ev.emit('open')
  }.bind(this)

  this._ws.onmessage = function (e) {
    var json = JSON.parse(e.data)

    if (typeof (this.onmessage) === 'function') {
      this.onmessage(json)
    }
    this._ev.emit(json.type, json)
  }.bind(this)

  this._ws.onclose = function (e) {
    if (typeof (this.onclose) === 'function') {
      this.onclose()
    }

    console.log('closed', e)
  }.bind(this)

  this._ws.onerror = function (e) {
    if (typeof (this.onerror) === 'function') {
      this.onerror()
    }
    console.log('error!', e)
  }.bind(this)
}

Webmo.prototype.getStatus = function getStatus () {
  var packed = JSON.stringify({type: 'status'})
  this._ws.send(packed)
}

//
// rotate
//
Webmo.prototype.rotate = function rotate (speed, option) {
  if (typeof speed === 'object') {
    option = speed
    speed = undefined
  }

  var packed = JSON.stringify({type: 'rotate', speed: speed})
  this._ws.send(packed)
}

Webmo.prototype.rotateTo = function rotateTo (target, absRange, speed) {
  var packed = JSON.stringify({type: 'rotateTo', target: target, absRange: absRange, speed: speed})
  this._ws.send(packed)

  // XXX: reject
  return Q.Promise(function (resolve, reject) {
    this._ev.once('notice', function (data) {
      if (data.msg === 'done' && data.func === 'rotateTo') {
        resolve(data)
      }
    })
  }.bind(this))
}

Webmo.prototype.rotateBy = function rotateBy (diff, speed) {
  var packed = JSON.stringify({type: 'rotateBy', diff: diff, speed: speed})
  this._ws.send(packed)

  // XXX: reject
  return Q.Promise(function (resolve, reject) {
    this._ev.once('notice', function (data) {
      if (data.msg === 'done' && data.func === 'rotateBy') {
        resolve(data)
      }
    })
  }.bind(this))
}

Webmo.prototype.rotateToHome = function rotateToHome () {
  console.log('not impl')
}

//
// Stop
//
Webmo.prototype.stopHard = function stopHard () {
  return this.stop(true, false)
}

Webmo.prototype.stopSoft = function stopSoft () {
  return this.stop(false, false)
}

Webmo.prototype.stop = function stop (smooth, lock) {
  var packed = JSON.stringify({type: 'stop', smooth: smooth, lock: lock})
  this._ws.send(packed)

  // XXX: reject
  return Q.Promise(function (resolve, reject) {
    this._ev.once('notice', function (data) {
      if (data.msg === 'stop rotating') {
        resolve(data)
      }
    })
  }.bind(this))
}
//
// lock
//
Webmo.prototype.lock = function lock (smooth) {
  var packed = JSON.stringify({type: 'lock', smooth: smooth})
  this._ws.send(packed)
}

Webmo.prototype.unlock = function unlock () {
  var packed = JSON.stringify({type: 'unlock'})
  this._ws.send(packed)
}

//
// goodies
//
Webmo.prototype.tick = function tick (timeMs) {
  var packed = JSON.stringify({type: 'tick', timeMs: timeMs})
  this._ws.send(packed)
}

//
// Home
//
Webmo.prototype.resetHome = function resetHome () {
  console.log('not impl')
}

// helper function
Webmo.prototype.degreeToStep = function degreeToStep (degree) {
  return degree / this.stepDegree
}

Webmo.prototype.stepToDegree = function stepToDegree (step) {
  return step * this.stepDegree / 128 // XXX: microstep must be supplied
}

Webmo.prototype.getSpeedPerSecondByStep = function getSpeedPerSecondByStep (step) {
  return Math.pow(2, 28) * step / Math.pow(10, 9) * 250
}

Webmo.prototype.getSpeedPerSecondByDegree = function getSpeedPerSecondByDegree (degree) {
  return this.getSpeedPerSecondByStep(this.degreeToStep(degree))
}

module.exports = Webmo
