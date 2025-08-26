"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const GRID_SIZE = 20
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400

interface Position {
  x: number
  y: number
}

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [focused, setFocused] = useState(false)

  const generateFood = useCallback(() => {
    const maxPosX = CANVAS_WIDTH / GRID_SIZE
    const maxPosY = CANVAS_HEIGHT / GRID_SIZE
    return {
      x: Math.floor(Math.random() * maxPosX),
      y: Math.floor(Math.random() * maxPosY),
    }
  }, [])

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }])
    setFood(generateFood())
    setDirection({ x: 0, y: 0 })
    setGameOver(false)
    setScore(0)
    setGameStarted(false)
  }

  const startGame = () => {
    setGameStarted(true)
    setDirection({ x: 1, y: 0 })
  }

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!focused || !gameStarted || gameOver) return

      e.preventDefault()

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          setDirection((prev) => (prev.y !== 1 ? { x: 0, y: -1 } : prev))
          break
        case "ArrowDown":
        case "s":
        case "S":
          setDirection((prev) => (prev.y !== -1 ? { x: 0, y: 1 } : prev))
          break
        case "ArrowLeft":
        case "a":
        case "A":
          setDirection((prev) => (prev.x !== 1 ? { x: -1, y: 0 } : prev))
          break
        case "ArrowRight":
        case "d":
        case "D":
          setDirection((prev) => (prev.x !== -1 ? { x: 1, y: 0 } : prev))
          break
      }
    },
    [focused, gameStarted, gameOver],
  )

  useEffect(() => {
    if (focused) {
      document.addEventListener("keydown", handleKeyPress)
      return () => document.removeEventListener("keydown", handleKeyPress)
    }
  }, [handleKeyPress, focused])

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const gameLoop = setInterval(() => {
      setSnake((currentSnake) => {
        const newSnake = [...currentSnake]
        const head = { ...newSnake[0] }

        head.x += direction.x
        head.y += direction.y

        // Check wall collision
        const maxPosX = CANVAS_WIDTH / GRID_SIZE
        const maxPosY = CANVAS_HEIGHT / GRID_SIZE
        if (head.x < 0 || head.x >= maxPosX || head.y < 0 || head.y >= maxPosY) {
          setGameOver(true)
          return currentSnake
        }

        // Check self collision
        if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true)
          return currentSnake
        }

        newSnake.unshift(head)

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore((prev) => prev + 10)
          setFood(generateFood())
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }, 100)

    return () => clearInterval(gameLoop)
  }, [direction, food, gameStarted, gameOver, generateFood])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw snake
    ctx.fillStyle = "#ffffff"
    snake.forEach((segment, index) => {
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2)

      // Draw head differently
      if (index === 0) {
        ctx.fillStyle = "#cccccc"
        ctx.fillRect(segment.x * GRID_SIZE + 2, segment.y * GRID_SIZE + 2, GRID_SIZE - 6, GRID_SIZE - 6)
        ctx.fillStyle = "#ffffff"
      }
    })

    // Draw food
    ctx.fillStyle = "#888888"
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2)
  }, [snake, food])

  return (
    <Card className="p-6 bg-background border-2 border-border w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Snake Game</h3>
        <div className="text-sm text-muted-foreground">Score: {score}</div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div
          className={`relative border-2 ${focused ? "border-primary" : "border-border"} rounded-lg overflow-hidden cursor-pointer w-full`}
          onClick={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          tabIndex={0}
        >
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="block w-full h-auto" />
          {!gameStarted && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="mb-2">Click to focus, then press any arrow key or WASD to start</p>
                <Button onClick={startGame} variant="outline" className="bg-white text-black hover:bg-gray-200">
                  Start Game
                </Button>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="mb-2">Game Over! Score: {score}</p>
                <Button onClick={resetGame} variant="outline" className="bg-white text-black hover:bg-gray-200">
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Click the game area to focus, then use arrow keys or WASD to control the snake
        </p>
      </div>
    </Card>
  )
}
