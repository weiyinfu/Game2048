Function.prototype.bind =
  Function.prototype.bind ||
  function(a) {
    var b = this
    return function(c) {
      c instanceof Array || (c = [c])
      b.apply(a, c)
    }
  }
;(function() {
  function a(a) {
    this.el = a
    a = a.className.replace(/^\s+|\s+$/g, "").split(/\s+/)
    for (var b = 0; b < a.length; b++) d.call(this, a[b])
  }
  function b(a, b, c) {
    Object.defineProperty ? Object.defineProperty(a, b, { get: c }) : a.__defineGetter__(b, c)
  }
  if (!("undefined" === typeof window.Element || "classList" in document.documentElement)) {
    var c = Array.prototype,
      d = c.push,
      e = c.splice,
      f = c.join
    a.prototype = {
      add: function(a) {
        this.contains(a) || (d.call(this, a), (this.el.className = this.toString()))
      },
      contains: function(a) {
        return -1 != this.el.className.indexOf(a)
      },
      item: function(a) {
        return this[a] || null
      },
      remove: function(a) {
        if (this.contains(a)) {
          for (var b = 0; b < this.length && this[b] != a; b++);
          e.call(this, b, 1)
          this.el.className = this.toString()
        }
      },
      toString: function() {
        return f.call(this, " ")
      },
      toggle: function(a) {
        this.contains(a) ? this.remove(a) : this.add(a)
        return this.contains(a)
      }
    }
    window.DOMTokenList = a
    b(HTMLElement.prototype, "classList", function() {
      return new a(this)
    })
  }
})()
;(function() {
  for (var a = 0, b = ["webkit", "moz"], c = 0; c < b.length && !window.requestAnimationFrame; ++c) (window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"]), (window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"])
  window.requestAnimationFrame ||
    (window.requestAnimationFrame = function(b, c) {
      var f = new Date().getTime(),
        h = Math.max(0, 16 - (f - a)),
        g = window.setTimeout(function() {
          b(f + h)
        }, h)
      a = f + h
      return g
    })
  window.cancelAnimationFrame ||
    (window.cancelAnimationFrame = function(a) {
      clearTimeout(a)
    })
})()
function KeyboardInputManager() {
  this.events = {}
  window.navigator.msPointerEnabled ? ((this.eventTouchstart = "MSPointerDown"), (this.eventTouchmove = "MSPointerMove"), (this.eventTouchend = "MSPointerUp")) : ((this.eventTouchstart = "touchstart"), (this.eventTouchmove = "touchmove"), (this.eventTouchend = "touchend"))
  this.listen()
}
KeyboardInputManager.prototype.on = function(a, b) {
  this.events[a] || (this.events[a] = [])
  this.events[a].push(b)
}
KeyboardInputManager.prototype.emit = function(a, b) {
  var c = this.events[a]
  c &&
    c.forEach(function(a) {
      a(b)
    })
}
KeyboardInputManager.prototype.listen = function() {
  var a = this,
    b = { 38: 0, 39: 1, 40: 2, 37: 3, 75: 0, 76: 1, 74: 2, 72: 3, 87: 0, 68: 1, 83: 2, 65: 3 }
  document.addEventListener("keydown", function(c) {
    var d = c.altKey || c.ctrlKey || c.metaKey || c.shiftKey,
      e = b[c.which]
    d || void 0 === e || (c.preventDefault(), a.emit("move", e))
    d || 82 !== c.which || a.restart.call(a, c)
  })
  this.bindButtonPress(".retry-button", this.restart)
  this.bindButtonPress(".restart-button", this.restart)
  this.bindButtonPress(".keep-playing-button", this.keepPlaying)
  var c,
    d,
    e = document.getElementsByClassName("game-container")[0]
  e.addEventListener(this.eventTouchstart, function(a) {
    ;(!window.navigator.msPointerEnabled && 1 < a.touches.length) || 1 < a.targetTouches || (window.navigator.msPointerEnabled ? ((c = a.pageX), (d = a.pageY)) : ((c = a.touches[0].clientX), (d = a.touches[0].clientY)), a.preventDefault())
  })
  e.addEventListener(this.eventTouchmove, function(a) {
    a.preventDefault()
  })
  e.addEventListener(this.eventTouchend, function(b) {
    if (!((!window.navigator.msPointerEnabled && 0 < b.touches.length) || 0 < b.targetTouches)) {
      var e, g
      window.navigator.msPointerEnabled ? ((e = b.pageX), (g = b.pageY)) : ((e = b.changedTouches[0].clientX), (g = b.changedTouches[0].clientY))
      e -= c
      b = Math.abs(e)
      g -= d
      var m = Math.abs(g)
      10 < Math.max(b, m) && a.emit("move", b > m ? (0 < e ? 1 : 3) : 0 < g ? 2 : 0)
    }
  })
}
KeyboardInputManager.prototype.restart = function(a) {
  a.preventDefault()
  this.emit("restart")
}
KeyboardInputManager.prototype.keepPlaying = function(a) {
  a.preventDefault()
  this.emit("keepPlaying")
}
KeyboardInputManager.prototype.bindButtonPress = function(a, b) {
  var c = document.querySelector(a)
  c.addEventListener("click", b.bind(this))
  c.addEventListener(this.eventTouchend, b.bind(this))
}
function HTMLActuator() {
  this.tileContainer = document.querySelector(".tile-container")
  this.scoreContainer = document.querySelector(".score-container")
  this.bestContainer = document.querySelector(".best-container")
  this.messageContainer = document.querySelector(".game-message")
  this.sharingContainer = document.querySelector(".score-sharing")
  this.score = 0
}
HTMLActuator.prototype.actuate = function(a, b) {
  var c = this
  window.requestAnimationFrame(function() {
    c.clearContainer(c.tileContainer)
    a.cells.forEach(function(a) {
      a.forEach(function(a) {
        a && c.addTile(a)
      })
    })
    c.updateScore(b.score)
    c.updateBestScore(b.bestScore)
    b.terminated && (b.over ? c.message(!1) : b.won && c.message(!0))
  })
}
HTMLActuator.prototype.continueGame = function() {
  this.clearMessage()
}
HTMLActuator.prototype.clearContainer = function(a) {
  for (; a.firstChild; ) a.removeChild(a.firstChild)
}
HTMLActuator.prototype.addTile = function(a) {
  var b = this,
    c = document.createElement("div"),
    d = document.createElement("div"),
    e = this.positionClass(a.previousPosition || { x: a.x, y: a.y }),
    f = ["tile", "tile-" + a.value, e]
  2048 < a.value && f.push("tile-super")
  this.applyClasses(c, f)
  d.classList.add("tile-inner")
  d.textContent = a.value
  a.previousPosition
    ? window.requestAnimationFrame(function() {
        f[2] = b.positionClass({ x: a.x, y: a.y })
        b.applyClasses(c, f)
      })
    : a.mergedFrom
    ? (f.push("tile-merged"),
      this.applyClasses(c, f),
      a.mergedFrom.forEach(function(a) {
        b.addTile(a)
      }))
    : (f.push("tile-new"), this.applyClasses(c, f))
  c.appendChild(d)
  this.tileContainer.appendChild(c)
}
HTMLActuator.prototype.applyClasses = function(a, b) {
  a.setAttribute("class", b.join(" "))
}
HTMLActuator.prototype.normalizePosition = function(a) {
  return { x: a.x + 1, y: a.y + 1 }
}
HTMLActuator.prototype.positionClass = function(a) {
  a = this.normalizePosition(a)
  return "tile-position-" + a.x + "-" + a.y
}
HTMLActuator.prototype.updateScore = function(a) {
  this.clearContainer(this.scoreContainer)
  var b = a - this.score
  this.score = a
  this.scoreContainer.textContent = this.score
  0 < b && ((a = document.createElement("div")), a.classList.add("score-addition"), (a.textContent = "+" + b), this.scoreContainer.appendChild(a))
}
HTMLActuator.prototype.updateBestScore = function(a) {
  this.bestContainer.textContent = a
}
HTMLActuator.prototype.message = function(a) {
  var b = a ? "You win!" : "Game over!"
  this.messageContainer.classList.add(a ? "game-won" : "game-over")
  this.messageContainer.getElementsByTagName("p")[0].textContent = b
  this.clearContainer(this.sharingContainer)
  this.sharingContainer.appendChild(this.scoreTweetButton())
  twttr.widgets.load()
}
HTMLActuator.prototype.clearMessage = function() {
  this.messageContainer.classList.remove("game-won")
  this.messageContainer.classList.remove("game-over")
}
HTMLActuator.prototype.scoreTweetButton = function() {
  var a = document.createElement("a")
  a.classList.add("twitter-share-button")
  a.setAttribute("href", "https://twitter.com/share")
  a.setAttribute("data-url", "http://2048game.com")
  a.setAttribute("data-counturl", "http://2048game.com")
  a.textContent = "Tweet"
  a.setAttribute("data-text", "I scored " + this.score + " points at 2048, a game where you join numbers to score high! #2048game")
  return a
}
function Grid(a, b) {
  this.size = a
  this.cells = b ? this.fromState(b) : this.empty()
}
Grid.prototype.empty = function() {
  for (var a = [], b = 0; b < this.size; b++) for (var c = (a[b] = []), d = 0; d < this.size; d++) c.push(null)
  return a
}
Grid.prototype.fromState = function(a) {
  for (var b = [], c = 0; c < this.size; c++)
    for (var d = (b[c] = []), e = 0; e < this.size; e++) {
      var f = a[c][e]
      d.push(f ? new Tile(f.position, f.value) : null)
    }
  return b
}
Grid.prototype.randomAvailableCell = function() {
  var a = this.availableCells()
  if (a.length) return a[Math.floor(Math.random() * a.length)]
}
Grid.prototype.availableCells = function() {
  var a = []
  this.eachCell(function(b, c, d) {
    d || a.push({ x: b, y: c })
  })
  return a
}
Grid.prototype.eachCell = function(a) {
  for (var b = 0; b < this.size; b++) for (var c = 0; c < this.size; c++) a(b, c, this.cells[b][c])
}
Grid.prototype.cellsAvailable = function() {
  return !!this.availableCells().length
}
Grid.prototype.cellAvailable = function(a) {
  return !this.cellOccupied(a)
}
Grid.prototype.cellOccupied = function(a) {
  return !!this.cellContent(a)
}
Grid.prototype.cellContent = function(a) {
  return this.withinBounds(a) ? this.cells[a.x][a.y] : null
}
Grid.prototype.insertTile = function(a) {
  this.cells[a.x][a.y] = a
}
Grid.prototype.removeTile = function(a) {
  this.cells[a.x][a.y] = null
}
Grid.prototype.withinBounds = function(a) {
  return 0 <= a.x && a.x < this.size && 0 <= a.y && a.y < this.size
}
Grid.prototype.serialize = function() {
  for (var a = [], b = 0; b < this.size; b++) for (var c = (a[b] = []), d = 0; d < this.size; d++) c.push(this.cells[b][d] ? this.cells[b][d].serialize() : null)
  return { size: this.size, cells: a }
}
function Tile(a, b) {
  this.x = a.x
  this.y = a.y
  this.value = b || 2
  this.mergedFrom = this.previousPosition = null
}
Tile.prototype.savePosition = function() {
  this.previousPosition = { x: this.x, y: this.y }
}
Tile.prototype.updatePosition = function(a) {
  this.x = a.x
  this.y = a.y
}
Tile.prototype.serialize = function() {
  return { position: { x: this.x, y: this.y }, value: this.value }
}
window.fakeStorage = {
  _data: {},
  setItem: function(a, b) {
    return (this._data[a] = String(b))
  },
  getItem: function(a) {
    return this._data.hasOwnProperty(a) ? this._data[a] : void 0
  },
  removeItem: function(a) {
    return delete this._data[a]
  },
  clear: function() {
    return (this._data = {})
  }
}
function LocalStorageManager() {
  this.bestScoreKey = "bestScore"
  this.gameStateKey = "gameState"
  this.storage = this.localStorageSupported() ? window.localStorage : window.fakeStorage
}
LocalStorageManager.prototype.localStorageSupported = function() {
  var a = window.localStorage
  try {
    return a.setItem("test", "1"), a.removeItem("test"), !0
  } catch (b) {
    return !1
  }
}
LocalStorageManager.prototype.getBestScore = function() {
  return this.storage.getItem(this.bestScoreKey) || 0
}
LocalStorageManager.prototype.setBestScore = function(a) {
  this.storage.setItem(this.bestScoreKey, a)
}
LocalStorageManager.prototype.getGameState = function() {
  var a = this.storage.getItem(this.gameStateKey)
  return a ? JSON.parse(a) : null
}
LocalStorageManager.prototype.setGameState = function(a) {
  this.storage.setItem(this.gameStateKey, JSON.stringify(a))
}
LocalStorageManager.prototype.clearGameState = function() {
  this.storage.removeItem(this.gameStateKey)
}
function GameManager(a, b, c, d) {
  this.size = a
  this.inputManager = new b()
  this.storageManager = new d()
  this.actuator = new c()
  this.startTiles = 2
  this.inputManager.on("move", this.move.bind(this))
  this.inputManager.on("restart", this.restart.bind(this))
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this))
  this.setup()
}
GameManager.prototype.restart = function() {
  this.storageManager.clearGameState()
  this.actuator.continueGame()
  this.setup()
}
GameManager.prototype.keepPlaying = function() {
  this.keepPlaying = !0
  this.actuator.continueGame()
}
GameManager.prototype.isGameTerminated = function() {
  return this.over || (this.won && !this.keepPlaying) ? !0 : !1
}
GameManager.prototype.setup = function() {
  var a = this.storageManager.getGameState()
  a ? ((this.grid = new Grid(a.grid.size, a.grid.cells)), (this.score = a.score), (this.over = a.over), (this.won = a.won), (this.keepPlaying = a.keepPlaying)) : ((this.grid = new Grid(this.size)), (this.score = 0), (this.keepPlaying = this.won = this.over = !1), this.addStartTiles())
  this.actuate()
}
GameManager.prototype.addStartTiles = function() {
  for (var a = 0; a < this.startTiles; a++) this.addRandomTile()
}
GameManager.prototype.addRandomTile = function() {
  if (this.grid.cellsAvailable()) {
    var a = 0.9 > Math.random() ? 2 : 4,
      a = new Tile(this.grid.randomAvailableCell(), a)
    this.grid.insertTile(a)
  }
}
GameManager.prototype.actuate = function() {
  this.storageManager.getBestScore() < this.score && this.storageManager.setBestScore(this.score)
  this.over ? this.storageManager.clearGameState() : this.storageManager.setGameState(this.serialize())
  this.actuator.actuate(this.grid, { score: this.score, over: this.over, won: this.won, bestScore: this.storageManager.getBestScore(), terminated: this.isGameTerminated() })
}
GameManager.prototype.serialize = function() {
  return { grid: this.grid.serialize(), score: this.score, over: this.over, won: this.won, keepPlaying: this.keepPlaying }
}
GameManager.prototype.prepareTiles = function() {
  this.grid.eachCell(function(a, b, c) {
    c && ((c.mergedFrom = null), c.savePosition())
  })
}
GameManager.prototype.moveTile = function(a, b) {
  this.grid.cells[a.x][a.y] = null
  this.grid.cells[b.x][b.y] = a
  a.updatePosition(b)
}
GameManager.prototype.move = function(a) {
  var b = this
  if (!this.isGameTerminated()) {
    var c,
      d,
      e = this.getVector(a),
      f = this.buildTraversals(e),
      h = !1
    this.prepareTiles()
    f.x.forEach(function(a) {
      f.y.forEach(function(f) {
        c = { x: a, y: f }
        if ((d = b.grid.cellContent(c))) {
          f = b.findFarthestPosition(c, e)
          var k = b.grid.cellContent(f.next)
          if (k && k.value === d.value && !k.mergedFrom) {
            var l = new Tile(f.next, 2 * d.value)
            l.mergedFrom = [d, k]
            b.grid.insertTile(l)
            b.grid.removeTile(d)
            d.updatePosition(f.next)
            b.score += l.value
            2048 === l.value && (b.won = !0)
          } else b.moveTile(d, f.farthest)
          b.positionsEqual(c, d) || (h = !0)
        }
      })
    })
    h && (this.addRandomTile(), this.movesAvailable() || (this.over = !0), this.actuate())
  }
}
GameManager.prototype.getVector = function(a) {
  return { 0: { x: 0, y: -1 }, 1: { x: 1, y: 0 }, 2: { x: 0, y: 1 }, 3: { x: -1, y: 0 } }[a]
}
GameManager.prototype.buildTraversals = function(a) {
  for (var b = { x: [], y: [] }, c = 0; c < this.size; c++) b.x.push(c), b.y.push(c)
  1 === a.x && (b.x = b.x.reverse())
  1 === a.y && (b.y = b.y.reverse())
  return b
}
GameManager.prototype.findFarthestPosition = function(a, b) {
  var c
  do (c = a), (a = { x: c.x + b.x, y: c.y + b.y })
  while (this.grid.withinBounds(a) && this.grid.cellAvailable(a))
  return { farthest: c, next: a }
}
GameManager.prototype.movesAvailable = function() {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable()
}
GameManager.prototype.tileMatchesAvailable = function() {
  for (var a, b = 0; b < this.size; b++)
    for (var c = 0; c < this.size; c++)
      if ((a = this.grid.cellContent({ x: b, y: c })))
        for (var d = 0; 4 > d; d++) {
          var e = this.getVector(d)
          if ((e = this.grid.cellContent({ x: b + e.x, y: c + e.y })) && e.value === a.value) return !0
        }
  return !1
}
GameManager.prototype.positionsEqual = function(a, b) {
  return a.x === b.x && a.y === b.y
}
window.requestAnimationFrame(function() {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager)
})
