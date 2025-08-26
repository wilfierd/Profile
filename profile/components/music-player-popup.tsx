"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, X, Music } from "lucide-react"

export function MusicPlayerPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true) // Auto-start playing
  const [volume, setVolume] = useState([30]) // Lower default volume
  const [isMuted, setIsMuted] = useState(false)
  const embedId = "0dHiDF_Kl7k" // Fixed embed ID for your video
  const currentTitle = "Lofi Hip Hop Music" // Fixed title

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Auto-start music when component mounts
  useEffect(() => {
    // Small delay to ensure everything is loaded
    const timer = setTimeout(() => {
      setIsPlaying(true)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 shadow-lg transition-all duration-300 hover:scale-110 border border-gray-600"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
          
          {/* Animated music waves when playing */}
          {isPlaying && (
            <div className="absolute -right-1 -top-1 flex space-x-px">
              <div className="w-1 bg-green-400 rounded-full animate-bounce" style={{ height: '3px', animationDelay: '0ms' }}></div>
              <div className="w-1 bg-green-400 rounded-full animate-bounce" style={{ height: '5px', animationDelay: '150ms' }}></div>
              <div className="w-1 bg-green-400 rounded-full animate-bounce" style={{ height: '3px', animationDelay: '300ms' }}></div>
            </div>
          )}
        </div>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <Card className="relative w-full max-w-4xl p-6 shadow-2xl bg-gray-900 border border-gray-600">
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Music Player</h2>
                    <p className="text-gray-400">Now playing: {currentTitle}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-gray-700 text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Hidden Audio Player - YouTube embedded as audio only */}
              <div className="hidden">
                <iframe
                  width="1"
                  height="1"
                  src={`https://www.youtube.com/embed/${embedId}?autoplay=${isPlaying ? 1 : 0}&loop=1&playlist=${embedId}&controls=0`}
                  title="Background Music"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
                />
              </div>

              {/* Visual Controls */}
              <div className="flex items-center justify-between bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                  </Button>
                  <div>
                    <p className="text-white font-semibold">{currentTitle}</p>
                    <p className="text-gray-400 text-sm">Lofi Hip Hop • Chill Beats</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    onClick={toggleMute}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-700 text-white"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <div className="w-32">
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-8 text-right">{volume[0]}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
