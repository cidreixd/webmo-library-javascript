var qwest = require('qwest')

var Webmo = function Webmo (host) {
  this.base = '//' + (host || 'webmo.local')
  this.base += '/api'
  qwest.base = this.base

  this._stepAngle = 1.8
}

Webmo.prototype.getStatus = function getStatus () {
  return qwest.get('/status')
}

/**
 * Webmoを回転させる．
 * 返却されるPromiseはWebリクエストのレスポンスとともに解決される．
 *
 * @param {number} [speed] - 回転速度を指定．(度/秒)
 * @returns {Promise}
 */
Webmo.prototype.rotate = function rotate (speed) {
  return qwest.post('/rotate/forever', {speed: speed})
}

Webmo.prototype.rotateTo = function rotateTo (position, absRange, speed) {
  var args = {
    degree: position,
    absRange: absRange,
    speed: speed,
    absolute: true
  }

  return qwest.post('/rotate', args)
}

/**
 * Webmoを任意の角度回転させる．正確に回転することができるが，外部による誤差は検出できないので注意．
 * 例: 何かに引っかかって回転しきれなかった．
 * 例: 動かないように手で固定した．
 * 変換されるPromiseはWebリクエストのレスポンスとともに解決される．
 * 回転の終了によって解決されるわけではないので注意．
 *
 * @param {number} [degree] - 回転角度を指定(度)
 * @param {number} [speed] - 回転速度を指定．(度/秒)
 * @returns {Promise}
 */
Webmo.prototype.rotateBy = function rotateBy (degree, speed) {
  var args = {
    degree: degree,
    speed: speed
  }

  return qwest.post('/rotate', args)
}

// XXX: Later
Webmo.prototype.rotateToHome = function rotateToHome () {
  return qwest.post('/rotate/home', {})
}

/**
 * Webmoを停止させる．
 *
 * @param {boolean} [smooth] - なめらかに停止させる．
 * @param {boolean} [lock] - 停止後モーターを固定して動かないようにする．
 * @returns {Promise}
 */
Webmo.prototype.stop = function stop (smooth, lock) {
  smooth = smooth || false
  lock = lock || false
  return qwest.post('/stop', {smooth: smooth, lock: lock})
}

/**
 * Webmoを急停止させる．
 * 停止後モーターを固定しない．
 *
 * @returns {Promise}
 */
Webmo.prototype.stopHard = function stopHard () {
  return qwest.post('/stop', {smooth: false})
}

/**
 * Webmoをなめらかに停止させる．
 * 停止後モーターを固定しない．
 *
 * @returns {Promise}
 */
Webmo.prototype.stopSoft = function stopSoft () {
  return qwest.post('/stop', {smooth: true})
}

/**
 * Webmoを急停止させる．
 * 停止後モーターを固定して動かないようにする．
 *
 * @returns {Promise}
 */
Webmo.prototype.lockHard = function () {
  return qwest.post('/stop', {smooth: false})
}

/**
 * Webmoをなめらかに停止させる．
 * 停止後モーターを固定して動かないようにする．
 *
 * @returns {Promise}
 */
Webmo.prototype.lockSoft = function () {
  return qwest.post('/stop', {smooth: true})
}

// XXX: Later
Webmo.prototype.resetHome = function resetHome () {
  return qwest.post('/home/reset', {})
}

/**
 * 度をステップ(ステッピングモーターが本来回転できる単位)に変換する
 *
 * @param {Number} [angle] - 度
 * @returns {Number} - ステップ
 */
Webmo.prototype.angleToStep = function angleToStep (angle) {
  return angle / this._stepAngle
}

/**
 * ステップを度に変換する．
 *
 * @param {Number} [step] - ステップ
 * @returns {Number} - 度
 */
Webmo.prototype.stepToAngle = function stepToAngle (step) {
  return step * this._stepAngle / 128 // XXX: microstep must be supplied
}


// XXX: Later
Webmo.prototype.getSpeedPerSecondByStep = function getSpeedPerSecondByStep (step) {
  return Math.pow(2, 28) * step / Math.pow(10, 9) * 250
}

// XXX: Later
Webmo.prototype.getSpeedPerSecondByAngle = function getSpeedPerSecondByAngle (angle) {
  return this.getSpeedPerSecondByStep(this.angleToStep(angle))
}

module.exports = Webmo
