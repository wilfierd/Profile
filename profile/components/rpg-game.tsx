"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Gamepad2 } from "lucide-react"

interface Position {
  x: number
  y: number
}

interface GameState {
  playerPos: Position
  isPlaying: boolean
  score: number
  timeElapsed: number
}

export function RPGGame() {
  const [gameState, setGameState] = useState<GameState>({
    playerPos: { x: 200, y: 150 },
    isPlaying: false,
    score: 0,
    timeElapsed: 0,
  })

  const [keys, setKeys] = useState<Set<string>>(new Set())

  // Game dimensions
  const GAME_WIDTH = 400
  const GAME_HEIGHT = 300
  const PLAYER_SIZE = 20
  const MOVE_SPEED = 3

  // Handle keyboard input
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(event.key)) {
      event.preventDefault()
      setKeys((prev) => new Set(prev).add(event.key.toLowerCase()))
    }
  }, [])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    setKeys((prev) => {
      const newKeys = new Set(prev)
      newKeys.delete(event.key.toLowerCase())
      return newKeys
    })
  }, [])

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying) return

    const gameLoop = setInterval(() => {
      setGameState((prev) => {
        let newX = prev.playerPos.x
        let newY = prev.playerPos.y

        // Handle movement
        if (keys.has("arrowleft") || keys.has("a")) {
          newX = Math.max(PLAYER_SIZE / 2, newX - MOVE_SPEED)
        }
        if (keys.has("arrowright") || keys.has("d")) {
          newX = Math.min(GAME_WIDTH - PLAYER_SIZE / 2, newX + MOVE_SPEED)
        }
        if (keys.has("arrowup") || keys.has("w")) {
          newY = Math.max(PLAYER_SIZE / 2, newY - MOVE_SPEED)
        }
        if (keys.has("arrowdown") || keys.has("s")) {
          newY = Math.min(GAME_HEIGHT - PLAYER_SIZE / 2, newY + MOVE_SPEED)
        }

        // Update score based on movement
        const moved = newX !== prev.playerPos.x || newY !== prev.playerPos.y
        const newScore = moved ? prev.score + 1 : prev.score

        return {
          ...prev,
          playerPos: { x: newX, y: newY },
          score: newScore,
          timeElapsed: prev.timeElapsed + 1,
        }
      })
    }, 16) // ~60 FPS

    return () => clearInterval(gameLoop)
  }, [gameState.isPlaying, keys])

  // Set up keyboard listeners
  useEffect(() => {
    if (gameState.isPlaying) {
      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)

      return () => {
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("keyup", handleKeyUp)
      }
    }
  }, [gameState.isPlaying, handleKeyDown, handleKeyUp])

  const startGame = () => {
    setGameState((prev) => ({ ...prev, isPlaying: true }))
  }

  const pauseGame = () => {
    setGameState((prev) => ({ ...prev, isPlaying: false }))
  }

  const resetGame = () => {
    setGameState({
      playerPos: { x: 200, y: 150 },
      isPlaying: false,
      score: 0,
      timeElapsed: 0,
    })
    setKeys(new Set())
  }

  const formatTime = (frames: number) => {
    const seconds = Math.floor(frames / 60)
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  return (
    <Card className="p-6 border-2 border-accent/20 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold text-card-foreground">Mini RPG Adventure</h2>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Score: {gameState.score}</Badge>
          <Badge variant="secondary">Time: {formatTime(gameState.timeElapsed)}</Badge>
          <Badge variant={gameState.isPlaying ? "default" : "outline"}>
            {gameState.isPlaying ? "Playing" : "Ready"}
          </Badge>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative mx-auto mb-4" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        <div
          className="relative bg-gradient-to-b from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 border-2 border-accent/30 rounded-lg overflow-hidden transition-all duration-300"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }, (_, i) => (
                <div key={i} className={`border border-accent/10 ${i % 2 === 0 ? "bg-accent/5" : ""}`} />
              ))}
            </div>
          </div>

          {/* Player Character */}
          <div
            className="absolute transition-none bg-primary rounded-full border-2 border-primary-foreground shadow-lg"
            style={{
              width: PLAYER_SIZE,
              height: PLAYER_SIZE,
              left: gameState.playerPos.x - PLAYER_SIZE / 2,
              top: gameState.playerPos.y - PLAYER_SIZE / 2,
              transform: "translate(0, 0)",
            }}
          >
            {/* Simple face */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs text-primary-foreground font-bold">•‿•</div>
            </div>
          </div>

          {/* Game overlay when not playing */}
          {!gameState.isPlaying && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  {gameState.timeElapsed > 0 ? "Game Paused" : "Ready to explore?"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">Use arrow keys or WASD to move around</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {!gameState.isPlaying ? (
          <Button
            onClick={startGame}
            className="bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
          >
            <Play className="w-4 h-4 mr-2" />
            {gameState.timeElapsed > 0 ? "Resume" : "Start Game"}
          </Button>
        ) : (
          <Button onClick={pauseGame} variant="outline" className="hover:bg-accent/10 bg-transparent">
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        )}

        <Button onClick={resetGame} variant="outline" className="hover:bg-accent/10 bg-transparent">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          <strong>Controls:</strong> Use Arrow Keys or WASD to move your character around the field. Explore and rack up
          points by moving!
        </p>
      </div>

      {/* Game Stats */}
      {gameState.timeElapsed > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-primary">{gameState.score}</div>
            <div className="text-xs text-muted-foreground">Movement Points</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">{formatTime(gameState.timeElapsed)}</div>
            <div className="text-xs text-muted-foreground">Time Played</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">
              {Math.round((gameState.score / Math.max(gameState.timeElapsed, 1)) * 60)}
            </div>
            <div className="text-xs text-muted-foreground">Points/Min</div>
          </div>
        </div>
      )}
    </Card>
  )
}
