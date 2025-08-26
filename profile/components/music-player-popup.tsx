"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, X, Music } from "lucide-react"

export function MusicPlayerPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true) // Auto-play on load
  const [volume, setVolume] = useState([30])
  const [isMuted, setIsMuted] = useState(false)
  const [embedId] = useState("0dHiDF_Kl7k") // Fixed video ID
  const [currentTitle] = useState("Background Music")

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Auto-play when component mounts
  useEffect(() => {
    setIsPlaying(true)
  }, [])

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 shadow-lg transition-all duration-300 hover:scale-105"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {isPlaying ? (
            <Music className="w-5 h-5 text-gray-300 animate-pulse" />
          ) : (
            <Play className="w-5 h-5 text-gray-300 ml-0.5" />
          )}
          
          {/* Sound waves animation when playing */}
          {isPlaying && (
            <div className="absolute -right-1 -top-1 flex space-x-px">
              <div className="w-0.5 bg-green-400 rounded-full animate-pulse" style={{ height: '3px', animationDelay: '0ms' }}></div>
              <div className="w-0.5 bg-green-400 rounded-full animate-pulse" style={{ height: '5px', animationDelay: '200ms' }}></div>
              <div className="w-0.5 bg-green-400 rounded-full animate-pulse" style={{ height: '3px', animationDelay: '400ms' }}></div>
            </div>
          )}
        </div>
      </Button>

      {/* Hidden iframe for audio playback */}
      <iframe
        width="0"
        height="0"
        src={`https://www.youtube.com/embed/${embedId}?autoplay=1&loop=1&playlist=${embedId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
        title="Background music player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        style={{ display: 'none' }}
      />

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <Card className="relative w-full max-w-md p-6 shadow-2xl bg-black/90 backdrop-blur-md border border-white/20">
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Music Player</h2>
                    <p className="text-gray-400 text-sm">{currentTitle}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/10 text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                  <Button
                    onClick={toggleMute}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-white/10 text-white"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <div className="flex-1">
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
