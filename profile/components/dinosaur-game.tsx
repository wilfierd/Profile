"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Gamepad2 } from "lucide-react"

interface GameState {
  mikuY: number
  mikuVelocity: number
  obstacles: Array<{ x: number; height: number }>
  isPlaying: boolean
  score: number
  gameSpeed: number
  isGameOver: boolean
}

export function DinosaurGame() {
  const [gameState, setGameState] = useState<GameState>({
    mikuY: 200,
    mikuVelocity: 0,
    obstacles: [],
    isPlaying: false,
    score: 0,
    gameSpeed: 2,
    isGameOver: false,
  })

  const GAME_WIDTH = 600
  const GAME_HEIGHT = 300
  const MIKU_SIZE = 40
  const GROUND_HEIGHT = 50
  const JUMP_FORCE = -12
  const GRAVITY = 0.6
  const OBSTACLE_WIDTH = 20

  // Handle jump input
  const handleJump = useCallback(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return

    setGameState((prev) => ({
      ...prev,
      mikuVelocity: prev.mikuY >= GAME_HEIGHT - GROUND_HEIGHT - MIKU_SIZE ? JUMP_FORCE : prev.mikuVelocity,
    }))
  }, [gameState.isPlaying, gameState.isGameOver])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.key === "ArrowUp" || event.key === "w") {
        event.preventDefault()
        handleJump()
      }
    }

    if (gameState.isPlaying) {
      window.addEventListener("keydown", handleKeyPress)
      return () => window.removeEventListener("keydown", handleKeyPress)
    }
  }, [gameState.isPlaying, handleJump])

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return

    const gameLoop = setInterval(() => {
      setGameState((prev) => {
        let newMikuY = prev.mikuY + prev.mikuVelocity
        let newVelocity = prev.mikuVelocity + GRAVITY

        // Ground collision
        const groundY = GAME_HEIGHT - GROUND_HEIGHT - MIKU_SIZE
        if (newMikuY >= groundY) {
          newMikuY = groundY
          newVelocity = 0
        }

        // Move obstacles
        const newObstacles = prev.obstacles
          .map((obstacle) => ({ ...obstacle, x: obstacle.x - prev.gameSpeed }))
          .filter((obstacle) => obstacle.x > -OBSTACLE_WIDTH)

        // Add new obstacles
        if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < GAME_WIDTH - 200) {
          newObstacles.push({
            x: GAME_WIDTH,
            height: 60 + Math.random() * 40,
          })
        }

        // Collision detection
        let isGameOver = false
        for (const obstacle of newObstacles) {
          if (
            obstacle.x < MIKU_SIZE + 20 &&
            obstacle.x + OBSTACLE_WIDTH > 20 &&
            newMikuY + MIKU_SIZE > GAME_HEIGHT - GROUND_HEIGHT - obstacle.height
          ) {
            isGameOver = true
            break
          }
        }

        return {
          ...prev,
          mikuY: newMikuY,
          mikuVelocity: newVelocity,
          obstacles: newObstacles,
          score: prev.score + 1,
          gameSpeed: Math.min(prev.gameSpeed + 0.001, 4),
          isGameOver,
        }
      })
    }, 16) // ~60 FPS

    return () => clearInterval(gameLoop)
  }, [gameState.isPlaying, gameState.isGameOver])

  const startGame = () => {
    setGameState((prev) => ({ ...prev, isPlaying: true, isGameOver: false }))
  }

  const pauseGame = () => {
    setGameState((prev) => ({ ...prev, isPlaying: false }))
  }

  const resetGame = () => {
    setGameState({
      mikuY: 200,
      mikuVelocity: 0,
      obstacles: [],
      isPlaying: false,
      score: 0,
      gameSpeed: 2,
      isGameOver: false,
    })
  }

  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Miku Runner</h2>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Score: {gameState.score}</Badge>
          <Badge variant={gameState.isPlaying && !gameState.isGameOver ? "default" : "outline"}>
            {gameState.isGameOver ? "Game Over" : gameState.isPlaying ? "Running" : "Ready"}
          </Badge>
        </div>
      </div>

      {/* Game Area */}
      <div
        className="relative mx-auto mb-4 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-2 border-border rounded-lg overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={handleJump}
      >
        {/* Ground */}
        <div className="absolute bottom-0 w-full bg-primary/20" style={{ height: GROUND_HEIGHT }} />

        <div
          className="absolute transition-none"
          style={{
            left: 20,
            top: gameState.mikuY,
            width: MIKU_SIZE,
            height: MIKU_SIZE,
          }}
        >
          {/* Miku body */}
          <div className="relative w-full h-full">
            {/* Hair (twin tails) */}
            <div className="absolute -top-2 -left-2 w-3 h-6 bg-cyan-400 rounded-full transform -rotate-12" />
            <div className="absolute -top-2 -right-2 w-3 h-6 bg-cyan-400 rounded-full transform rotate-12" />

            {/* Head */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-pink-200 rounded-full border-2 border-primary">
              {/* Eyes */}
              <div className="absolute top-1 left-1 w-1 h-1 bg-primary rounded-full" />
              <div className="absolute top-1 right-1 w-1 h-1 bg-primary rounded-full" />
              {/* Mouth */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1 h-0.5 bg-primary rounded-full" />
            </div>

            {/* Body */}
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-gray-700 rounded-sm">
              {/* Tie */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-cyan-400" />
            </div>

            {/* Arms */}
            <div className="absolute top-6 left-0 w-2 h-4 bg-pink-200 rounded-full" />
            <div className="absolute top-6 right-0 w-2 h-4 bg-pink-200 rounded-full" />

            {/* Legs */}
            <div className="absolute bottom-0 left-1 w-1.5 h-4 bg-pink-200 rounded-full" />
            <div className="absolute bottom-0 right-1 w-1.5 h-4 bg-pink-200 rounded-full" />
          </div>
        </div>

        {/* Obstacles */}
        {gameState.obstacles.map((obstacle, index) => (
          <div
            key={index}
            className="absolute bg-primary"
            style={{
              left: obstacle.x,
              bottom: GROUND_HEIGHT,
              width: OBSTACLE_WIDTH,
              height: obstacle.height,
            }}
          />
        ))}

        {/* Game overlay */}
        {(!gameState.isPlaying || gameState.isGameOver) && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">
                {gameState.isGameOver ? `Game Over! Score: ${gameState.score}` : "Ready to run with Miku?"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">Press Space, ↑, or click to jump over obstacles</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {!gameState.isPlaying || gameState.isGameOver ? (
          <Button
            onClick={startGame}
            className="bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
          >
            <Play className="w-4 h-4 mr-2" />
            {gameState.isGameOver ? "Play Again" : "Start Game"}
          </Button>
        ) : (
          <Button onClick={pauseGame} variant="outline">
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        )}

        <Button onClick={resetGame} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          <strong>Controls:</strong> Press Space, Arrow Up, W, or click the game area to make Miku jump over obstacles!
        </p>
      </div>
    </Card>
  )
}
