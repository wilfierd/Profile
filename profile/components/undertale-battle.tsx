"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Heart } from "lucide-react"

interface Bullet {
  x: number
  y: number
  vx: number
  vy: number
  id: number
  type: "normal" | "blue" | "orange"
  size: number
  rotation?: number
}

interface GameState {
  playerX: number
  playerY: number
  bullets: Bullet[]
  isPlaying: boolean
  hp: number
  maxHp: number
  isGameOver: boolean
  attackPhase: boolean
  turnCount: number
  enemyType: string
  attackPattern: number
  phaseTimer: number
}

export function UndertaleBattle() {
  const battleBoxRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [gameState, setGameState] = useState<GameState>({
    playerX: 146,
    playerY: 121,
    bullets: [],
    isPlaying: false,
    hp: 20,
    maxHp: 20,
    isGameOver: false,
    attackPhase: false,
    turnCount: 0,
    enemyType: "Flowey",
    attackPattern: 0,
    phaseTimer: 0,
  })

  const [keys, setKeys] = useState<Set<string>>(new Set())
  const [isMoving, setIsMoving] = useState(false)

  const BATTLE_BOX_WIDTH = 300
  const BATTLE_BOX_HEIGHT = 250
  const HEART_SIZE = 8
  const HEART_SPEED = 2.5

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFocused) return

      const key = event.key.toLowerCase()
      setKeys((prev) => new Set(prev).add(key))
      if (["w", "a", "s", "d", "arrowup", "arrowleft", "arrowdown", "arrowright"].includes(key)) {
        setIsMoving(true)
        event.preventDefault()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!isFocused) return

      const key = event.key.toLowerCase()
      setKeys((prev) => {
        const newKeys = new Set(prev)
        newKeys.delete(key)
        return newKeys
      })

      const movementKeys = ["w", "a", "s", "d", "arrowup", "arrowleft", "arrowdown", "arrowright"]
      const hasMovementKey = Array.from(keys).some((k) => movementKeys.includes(k) && k !== key)
      if (!hasMovementKey) {
        setIsMoving(false)
      }
    }

    if (gameState.isPlaying && gameState.attackPhase) {
      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("keyup", handleKeyUp)
      }
    }
  }, [gameState.isPlaying, gameState.attackPhase, keys, isFocused])

  useEffect(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return

    const gameLoop = setInterval(() => {
      setGameState((prev) => {
        let newState = { ...prev }

        if (prev.attackPhase) {
          let newPlayerX = prev.playerX
          let newPlayerY = prev.playerY
          const speed = HEART_SPEED

          if (keys.has("a") || keys.has("arrowleft")) {
            newPlayerX = Math.max(0, newPlayerX - speed)
          }
          if (keys.has("d") || keys.has("arrowright")) {
            newPlayerX = Math.min(BATTLE_BOX_WIDTH - HEART_SIZE, newPlayerX + speed)
          }
          if (keys.has("w") || keys.has("arrowup")) {
            newPlayerY = Math.max(0, newPlayerY - speed)
          }
          if (keys.has("s") || keys.has("arrowdown")) {
            newPlayerY = Math.min(BATTLE_BOX_HEIGHT - HEART_SIZE, newPlayerY + speed)
          }

          let newBullets = prev.bullets
            .map((bullet) => {
              const newBullet = {
                ...bullet,
                x: bullet.x + bullet.vx,
                y: bullet.y + bullet.vy,
              }

              if (bullet.rotation !== undefined) {
                newBullet.rotation = (bullet.rotation + 5) % 360
              }

              return newBullet
            })
            .filter(
              (bullet) =>
                bullet.x > -bullet.size * 2 &&
                bullet.x < BATTLE_BOX_WIDTH + bullet.size * 2 &&
                bullet.y > -bullet.size * 2 &&
                bullet.y < BATTLE_BOX_HEIGHT + bullet.size * 2,
            )

          let newHp = prev.hp
          let isGameOver = false
          newBullets = newBullets.filter((bullet) => {
            const heartCenterX = newPlayerX + HEART_SIZE / 2
            const heartCenterY = newPlayerY + HEART_SIZE / 2
            const bulletCenterX = bullet.x + bullet.size / 2
            const bulletCenterY = bullet.y + bullet.size / 2

            const distance = Math.sqrt(
              Math.pow(heartCenterX - bulletCenterX, 2) + Math.pow(heartCenterY - bulletCenterY, 2),
            )

            if (distance < (HEART_SIZE + bullet.size) / 2) {
              if (bullet.type === "blue" && !isMoving) {
                return true
              }
              if (bullet.type === "orange" && isMoving) {
                return true
              }

              newHp -= bullet.type === "normal" ? 1 : 2
              if (newHp <= 0) {
                isGameOver = true
              }
              return false
            }
            return true
          })

          newState = {
            ...newState,
            playerX: newPlayerX,
            playerY: newPlayerY,
            bullets: newBullets,
            hp: newHp,
            isGameOver,
            phaseTimer: prev.phaseTimer + 16,
          }
        }

        if (!prev.attackPhase && prev.isPlaying && !prev.isGameOver) {
          if (prev.phaseTimer > 2000) {
            newState = {
              ...newState,
              attackPhase: true,
              phaseTimer: 0,
              attackPattern: (prev.attackPattern + 1) % 6,
              bullets: [],
            }
          } else {
            newState.phaseTimer = prev.phaseTimer + 16
          }
        } else if (prev.attackPhase && prev.phaseTimer > 8000) {
          newState = {
            ...newState,
            attackPhase: false,
            phaseTimer: 0,
            turnCount: prev.turnCount + 1,
            bullets: [],
          }
        }

        return newState
      })
    }, 16)

    return () => clearInterval(gameLoop)
  }, [gameState.isPlaying, gameState.isGameOver, keys, isMoving])

  useEffect(() => {
    if (!gameState.isPlaying || gameState.isGameOver || !gameState.attackPhase) return

    const spawnBullets = () => {
      setGameState((prev) => {
        if (!prev.attackPhase) return prev

        const newBullets = [...prev.bullets]
        const pattern = prev.attackPattern
        const time = prev.phaseTimer / 1000

        console.log("[v0] Spawning bullets - Pattern:", pattern, "Time:", time, "Current bullets:", prev.bullets.length)

        switch (pattern) {
          case 0: // Petal Ring - spawn more frequently
            for (let i = 0; i < 6; i++) {
              const angle = (i / 6) * Math.PI * 2 + time * 0.8
              const radius = 50 + Math.sin(time * 3) * 15
              const centerX = BATTLE_BOX_WIDTH / 2
              const centerY = BATTLE_BOX_HEIGHT / 2
              newBullets.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                vx: Math.cos(angle) * -1.5, // Increased speed for visibility
                vy: Math.sin(angle) * -1.5,
                id: Date.now() + Math.random() + i,
                type: "normal",
                size: 8, // Increased size for visibility
                rotation: (angle * 180) / Math.PI,
              })
            }
            break

          case 1: // Color Bullets - more frequent spawning
            for (let i = 0; i < 3; i++) {
              // Increased bullet count
              newBullets.push({
                x: -8,
                y: 30 + i * 50 + Math.random() * 40,
                vx: 2, // Increased speed
                vy: 0,
                id: Date.now() + Math.random() + i,
                type: "blue",
                size: 10, // Increased size
              })
            }
            for (let i = 0; i < 3; i++) {
              // Increased bullet count
              newBullets.push({
                x: BATTLE_BOX_WIDTH + 8,
                y: 40 + i * 40 + Math.random() * 30,
                vx: -2, // Increased speed
                vy: 0,
                id: Date.now() + Math.random() + i + 10,
                type: "orange",
                size: 10, // Increased size
              })
            }
            break

          case 2: // Spiral Dance - continuous spiral
            const spiralAngle = time * 4
            for (let i = 0; i < 3; i++) {
              const angle = spiralAngle + i * ((Math.PI * 2) / 3)
              newBullets.push({
                x: BATTLE_BOX_WIDTH / 2 + Math.cos(angle) * 70,
                y: BATTLE_BOX_HEIGHT / 2 + Math.sin(angle) * 50,
                vx: Math.cos(angle + Math.PI) * 1.2, // Slower speed
                vy: Math.sin(angle + Math.PI) * 1.2,
                id: Date.now() + Math.random() + i,
                type: "normal",
                size: 6,
              })
            }
            break

          case 3: // Cross Fire - more bullets
            if (Math.floor(time * 4) % 2 === 0) {
              for (let i = 0; i < 4; i++) {
                newBullets.push({
                  x: i * 60 + 20,
                  y: -6,
                  vx: 0,
                  vy: 1.8, // Slower speed
                  id: Date.now() + Math.random() + i,
                  type: "normal",
                  size: 7,
                })
              }
            } else {
              for (let i = 0; i < 3; i++) {
                newBullets.push({
                  x: -6,
                  y: i * 60 + 30,
                  vx: 1.8, // Slower speed
                  vy: 0,
                  id: Date.now() + Math.random() + i,
                  type: "normal",
                  size: 7,
                })
              }
            }
            break

          case 4: // Bouncing Chaos - more frequent
            for (let i = 0; i < 2; i++) {
              newBullets.push({
                x: Math.random() * (BATTLE_BOX_WIDTH - 20) + 10,
                y: -6,
                vx: (Math.random() - 0.5) * 1.5,
                vy: 2, // Slower speed
                id: Date.now() + Math.random() + i,
                type: "normal",
                size: 8,
              })
            }
            break

          case 5: // Mixed Assault - more chaotic
            const chaosPattern = Math.floor(time * 3) % 4
            for (let j = 0; j < 2; j++) {
              const side = Math.floor(Math.random() * 4)
              let x, y, vx, vy
              switch (side) {
                case 0: // Top
                  x = Math.random() * BATTLE_BOX_WIDTH
                  y = -6
                  vx = (Math.random() - 0.5) * 1.5
                  vy = 1.5 + Math.random() * 0.5 // Slower speed
                  break
                case 1: // Right
                  x = BATTLE_BOX_WIDTH + 6
                  y = Math.random() * BATTLE_BOX_HEIGHT
                  vx = -(1.5 + Math.random() * 0.5) // Slower speed
                  vy = (Math.random() - 0.5) * 1.5
                  break
                case 2: // Bottom
                  x = Math.random() * BATTLE_BOX_WIDTH
                  y = BATTLE_BOX_HEIGHT + 6
                  vx = (Math.random() - 0.5) * 1.5
                  vy = -(1.5 + Math.random() * 0.5) // Slower speed
                  break
                default: // Left
                  x = -6
                  y = Math.random() * BATTLE_BOX_HEIGHT
                  vx = 1.5 + Math.random() * 0.5 // Slower speed
                  vy = (Math.random() - 0.5) * 1.5
              }
              newBullets.push({
                x,
                y,
                vx,
                vy,
                id: Date.now() + Math.random() + j,
                type: Math.random() > 0.6 ? (Math.random() > 0.5 ? "blue" : "orange") : "normal",
                size: 5 + Math.random() * 3,
              })
            }
            break
        }

        console.log("[v0] Added", newBullets.length - prev.bullets.length, "new bullets")
        return { ...prev, bullets: newBullets }
      })
    }

    const bulletInterval = setInterval(spawnBullets, 150) // Reduced interval for more frequent spawning
    return () => clearInterval(bulletInterval)
  }, [gameState.attackPhase, gameState.attackPattern, gameState.phaseTimer])

  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      isGameOver: false,
      attackPhase: false,
      phaseTimer: 0,
      bullets: [],
    }))
  }

  const pauseGame = () => {
    setGameState((prev) => ({ ...prev, isPlaying: false, attackPhase: false }))
  }

  const resetGame = () => {
    setGameState({
      playerX: 146,
      playerY: 121,
      bullets: [],
      isPlaying: false,
      hp: 20,
      maxHp: 20,
      isGameOver: false,
      attackPhase: false,
      turnCount: 0,
      enemyType: "Flowey",
      attackPattern: 0,
      phaseTimer: 0,
    })
    setKeys(new Set())
    setIsMoving(false)
  }

  const getEnemyName = () => {
    const enemies = ["Flowey", "Froggit", "Whimsun", "Moldsmal", "Loox", "Vegetoid"]
    return enemies[gameState.attackPattern % enemies.length]
  }

  const getAttackName = () => {
    const attacks = ["Petal Ring", "Color Bullets", "Spiral Dance", "Cross Fire", "Bouncing Chaos", "Mixed Assault"]
    return attacks[gameState.attackPattern % attacks.length]
  }

  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-semibold">Undertale Battle</h2>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">{getEnemyName()}</Badge>
          <Badge variant={gameState.hp > 10 ? "default" : "destructive"}>
            HP: {gameState.hp}/{gameState.maxHp}
          </Badge>
          <Badge variant={gameState.isPlaying && !gameState.isGameOver ? "default" : "outline"}>
            {gameState.isGameOver
              ? "Game Over"
              : gameState.attackPhase
                ? getAttackName()
                : gameState.isPlaying
                  ? "Preparing..."
                  : "Ready"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col items-center mb-4">
        <div className="w-full max-w-md mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-mono">HP</span>
            <div className="flex-1 h-4 bg-gray-800 border border-white">
              <div
                className="h-full bg-yellow-400 transition-all duration-300"
                style={{ width: `${(gameState.hp / gameState.maxHp) * 100}%` }}
              />
            </div>
            <span className="text-sm font-mono">
              {gameState.hp} / {gameState.maxHp}
            </span>
          </div>
        </div>

        <div
          ref={battleBoxRef}
          className={`relative bg-black border-4 border-white mb-4 cursor-pointer transition-all duration-200 ${
            isFocused ? "ring-2 ring-blue-400 ring-opacity-50" : ""
          }`}
          style={{
            width: BATTLE_BOX_WIDTH,
            height: BATTLE_BOX_HEIGHT,
            imageRendering: "pixelated",
          }}
          onClick={() => {
            setIsFocused(true)
            battleBoxRef.current?.focus()
          }}
          onBlur={() => setIsFocused(false)}
          tabIndex={0}
        >
          <div
            className={`absolute transition-all duration-75 ${isMoving ? "animate-pulse" : ""}`}
            style={{
              left: gameState.playerX,
              top: gameState.playerY,
              width: HEART_SIZE,
              height: HEART_SIZE,
            }}
          >
            <div className="w-full h-full bg-red-500 transform rotate-45" style={{ imageRendering: "pixelated" }} />
          </div>

          {gameState.bullets.map((bullet) => (
            <div
              key={bullet.id}
              className={`absolute ${
                bullet.type === "blue" ? "bg-blue-400" : bullet.type === "orange" ? "bg-orange-400" : "bg-white"
              }`}
              style={{
                left: bullet.x,
                top: bullet.y,
                width: bullet.size,
                height: bullet.size,
                imageRendering: "pixelated",
                transform: bullet.rotation ? `rotate(${bullet.rotation}deg)` : undefined,
                borderRadius: bullet.type !== "normal" ? "50%" : "0",
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-md p-3 bg-black border-2 border-white text-white font-mono text-sm">
          {gameState.isGameOver ? (
            <p>* But it refused.</p>
          ) : gameState.attackPhase ? (
            <p>
              * {getEnemyName()} attacks with {getAttackName()}!
            </p>
          ) : gameState.isPlaying ? (
            <p>* The air crackles with tension...</p>
          ) : (
            <p>* A strange light fills the room. You are filled with determination.</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        {!gameState.isPlaying || gameState.isGameOver ? (
          <Button
            onClick={startGame}
            className="bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
          >
            <Play className="w-4 h-4 mr-2" />
            {gameState.isGameOver ? "Continue" : "Start Battle"}
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
          <strong>CONTROLS:</strong> Click battle box to focus • WASD or Arrow Keys to move • Blue bullets: Don't move •
          Orange bullets: Keep moving
        </p>
      </div>
    </Card>
  )
}
