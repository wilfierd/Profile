"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Gamepad2 } from "lucide-react"

interface GameState {
  playerX: number
  playerY: number
  bullets: Array<{ x: number; y: number; id: number }>
  nukes: Array<{ x: number; y: number; id: number }>
  enemies: Array<{ x: number; y: number; id: number }>
  isPlaying: boolean
  score: number
  lives: number
  isGameOver: boolean
}

export function SpaceBattleGame() {
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const [gameState, setGameState] = useState<GameState>({
    playerX: 280,
    playerY: 350,
    bullets: [],
    nukes: [],
    enemies: [],
    isPlaying: false,
    score: 0,
    lives: 3,
    isGameOver: false,
  })

  const [keys, setKeys] = useState<Set<string>>(new Set())

  const GAME_WIDTH = 600
  const GAME_HEIGHT = 400
  const PLAYER_SIZE = 20
  const BULLET_SIZE = 3
  const NUKE_SIZE = 8
  const ENEMY_SIZE = 16
  const BULLET_SPEED = 10
  const NUKE_SPEED = 6
  const ENEMY_SPEED = 1.5

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeys((prev) => new Set(prev).add(event.key.toLowerCase()))
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeys((prev) => {
        const newKeys = new Set(prev)
        newKeys.delete(event.key.toLowerCase())
        return newKeys
      })
    }

    if (gameState.isPlaying) {
      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("keyup", handleKeyUp)
      }
    }
  }, [gameState.isPlaying])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!gameAreaRef.current || !gameState.isPlaying) return

      const rect = gameAreaRef.current.getBoundingClientRect()
      const mouseX = event.clientX - rect.left - PLAYER_SIZE / 2
      const mouseY = event.clientY - rect.top - PLAYER_SIZE / 2

      setGameState((prev) => ({
        ...prev,
        playerX: Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, mouseX)),
        playerY: Math.max(0, Math.min(GAME_HEIGHT - PLAYER_SIZE, mouseY)),
      }))
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (!gameState.isPlaying || gameState.isGameOver) return

      event.preventDefault()

      setGameState((prev) => {
        if (event.button === 0) {
          // Left click - regular bullet
          return {
            ...prev,
            bullets: [
              ...prev.bullets,
              {
                x: prev.playerX + PLAYER_SIZE / 2,
                y: prev.playerY,
                id: Date.now() + Math.random(),
              },
            ],
          }
        } else if (event.button === 2) {
          // Right click - nuke
          return {
            ...prev,
            nukes: [
              ...prev.nukes,
              {
                x: prev.playerX + PLAYER_SIZE / 2,
                y: prev.playerY,
                id: Date.now() + Math.random(),
              },
            ],
          }
        }
        return prev
      })
    }

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault() // Prevent right-click context menu
    }

    if (gameState.isPlaying && gameAreaRef.current) {
      const gameArea = gameAreaRef.current
      gameArea.addEventListener("mousemove", handleMouseMove)
      gameArea.addEventListener("mousedown", handleMouseDown)
      gameArea.addEventListener("contextmenu", handleContextMenu)

      return () => {
        gameArea.removeEventListener("mousemove", handleMouseMove)
        gameArea.removeEventListener("mousedown", handleMouseDown)
        gameArea.removeEventListener("contextmenu", handleContextMenu)
      }
    }
  }, [gameState.isPlaying, gameState.isGameOver])

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return

    const gameLoop = setInterval(() => {
      setGameState((prev) => {
        let newPlayerX = prev.playerX
        let newPlayerY = prev.playerY

        // Player movement
        if (keys.has("a") || keys.has("arrowleft")) {
          newPlayerX = Math.max(0, newPlayerX - PLAYER_SIZE)
        }
        if (keys.has("d") || keys.has("arrowright")) {
          newPlayerX = Math.min(GAME_WIDTH - PLAYER_SIZE, newPlayerX + PLAYER_SIZE)
        }
        if (keys.has("w") || keys.has("arrowup")) {
          newPlayerY = Math.max(0, newPlayerY - PLAYER_SIZE)
        }
        if (keys.has("s") || keys.has("arrowdown")) {
          newPlayerY = Math.min(GAME_HEIGHT - PLAYER_SIZE, newPlayerY + PLAYER_SIZE)
        }

        // Move bullets
        let newBullets = prev.bullets
          .map((bullet) => ({ ...bullet, y: bullet.y - BULLET_SPEED }))
          .filter((bullet) => bullet.y > -BULLET_SIZE)

        // Move nukes
        let newNukes = prev.nukes
          .map((nuke) => ({ ...nuke, y: nuke.y - NUKE_SPEED }))
          .filter((nuke) => nuke.y > -NUKE_SIZE)

        // Move enemies
        let newEnemies = prev.enemies
          .map((enemy) => ({ ...enemy, y: enemy.y + ENEMY_SPEED }))
          .filter((enemy) => enemy.y < GAME_HEIGHT + ENEMY_SIZE)

        // Spawn new enemies
        if (Math.random() < 0.015) {
          newEnemies.push({
            x: Math.random() * (GAME_WIDTH - ENEMY_SIZE),
            y: -ENEMY_SIZE,
            id: Date.now() + Math.random(),
          })
        }

        // Collision detection - bullets vs enemies
        let newScore = prev.score
        newBullets = newBullets.filter((bullet) => {
          const hitEnemy = newEnemies.find(
            (enemy) =>
              bullet.x > enemy.x - BULLET_SIZE &&
              bullet.x < enemy.x + ENEMY_SIZE &&
              bullet.y > enemy.y - BULLET_SIZE &&
              bullet.y < enemy.y + ENEMY_SIZE,
          )
          if (hitEnemy) {
            newEnemies = newEnemies.filter((enemy) => enemy.id !== hitEnemy.id)
            newScore += 10
            return false
          }
          return true
        })

        // Collision detection - nukes vs enemies (larger blast radius)
        newNukes = newNukes.filter((nuke) => {
          const hitEnemies = newEnemies.filter(
            (enemy) =>
              Math.abs(nuke.x - (enemy.x + ENEMY_SIZE / 2)) < 40 && Math.abs(nuke.y - (enemy.y + ENEMY_SIZE / 2)) < 40,
          )
          if (hitEnemies.length > 0) {
            hitEnemies.forEach((hitEnemy) => {
              newEnemies = newEnemies.filter((enemy) => enemy.id !== hitEnemy.id)
              newScore += 25 // Higher score for nuke kills
            })
            return false
          }
          return true
        })

        // Collision detection - player vs enemies
        let newLives = prev.lives
        let isGameOver = false
        newEnemies = newEnemies.filter((enemy) => {
          if (
            prev.playerX < enemy.x + ENEMY_SIZE &&
            prev.playerX + PLAYER_SIZE > enemy.x &&
            prev.playerY < enemy.y + ENEMY_SIZE &&
            prev.playerY + PLAYER_SIZE > enemy.y
          ) {
            newLives -= 1
            if (newLives <= 0) {
              isGameOver = true
            }
            return false
          }
          return true
        })

        return {
          ...prev,
          playerX: newPlayerX,
          playerY: newPlayerY,
          bullets: newBullets,
          nukes: newNukes,
          enemies: newEnemies,
          score: newScore,
          lives: newLives,
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
      playerX: 280,
      playerY: 350,
      bullets: [],
      nukes: [],
      enemies: [],
      isPlaying: false,
      score: 0,
      lives: 3,
      isGameOver: false,
    })
  }

  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Retro Pixel Battle</h2>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Score: {gameState.score}</Badge>
          <Badge variant="outline">Lives: {gameState.lives}</Badge>
          <Badge variant={gameState.isPlaying && !gameState.isGameOver ? "default" : "outline"}>
            {gameState.isGameOver ? "Game Over" : gameState.isPlaying ? "Fighting" : "Ready"}
          </Badge>
        </div>
      </div>

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="relative mx-auto mb-4 bg-black border-2 border-white rounded-none cursor-crosshair"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          imageRendering: "pixelated",
        }}
      >
        {/* Retro grid background */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full border-t border-white"
              style={{ top: `${(i * 100) / 20}%` }}
            />
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full border-l border-white"
              style={{ left: `${(i * 100) / 30}%` }}
            />
          ))}
        </div>

        <div
          className="absolute"
          style={{
            left: gameState.playerX,
            top: gameState.playerY,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
          }}
        >
          <div className="w-full h-full bg-white" style={{ imageRendering: "pixelated" }}>
            {/* Simple white square for retro look */}
            <div className="w-full h-full bg-white border border-gray-300" />
          </div>
        </div>

        {gameState.bullets.map((bullet) => (
          <div
            key={bullet.id}
            className="absolute bg-white"
            style={{
              left: bullet.x,
              top: bullet.y,
              width: BULLET_SIZE,
              height: BULLET_SIZE * 2,
              imageRendering: "pixelated",
            }}
          />
        ))}

        {gameState.nukes.map((nuke) => (
          <div
            key={nuke.id}
            className="absolute bg-white border border-gray-400"
            style={{
              left: nuke.x - NUKE_SIZE / 2,
              top: nuke.y,
              width: NUKE_SIZE,
              height: NUKE_SIZE,
              imageRendering: "pixelated",
            }}
          />
        ))}

        {gameState.enemies.map((enemy) => (
          <div
            key={enemy.id}
            className="absolute bg-gray-400 border border-gray-600"
            style={{
              left: enemy.x,
              top: enemy.y,
              width: ENEMY_SIZE,
              height: ENEMY_SIZE,
              imageRendering: "pixelated",
            }}
          />
        ))}

        {/* Game overlay */}
        {(!gameState.isPlaying || gameState.isGameOver) && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-lg font-mono mb-2">
                {gameState.isGameOver ? `GAME OVER! SCORE: ${gameState.score}` : "READY TO FIGHT?"}
              </p>
              <p className="text-sm font-mono mb-4">MOUSE TO MOVE • LEFT CLICK TO SHOOT • RIGHT CLICK FOR NUKE</p>
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
            {gameState.isGameOver ? "Play Again" : "Start Battle"}
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

      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground text-center font-mono">
          <strong>CONTROLS:</strong> Move mouse to control player • Left click to shoot • Right click for nuke blast
        </p>
      </div>
    </Card>
  )
}
