"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, X, Music } from "lucide-react"

export function MusicPlayerPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([30]) // Default to 30%
  const [isMuted, setIsMuted] = useState(false)
  const [currentTitle, setCurrentTitle] = useState("Loficity - Heart Strings")
  const youtubeUrl = "https://youtu.be/0dHiDF_Kl7k"
  const embedId = "0dHiDF_Kl7k"

  const handleTrackClick = () => {
    window.open(youtubeUrl, '_blank')
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 shadow-lg transition-all duration-300 hover:scale-105 border border-gray-600"
      >
        <Music className="w-5 h-5 text-gray-300" />
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
                    <Music className="w-6 h-6 text-gray-300" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Music Player</h2>
                    <p 
                      className="text-gray-400 cursor-pointer hover:text-white transition-colors"
                      onClick={handleTrackClick}
                      title="Click to open on YouTube"
                    >
                      Now playing: {currentTitle}
                    </p>
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

              {/* Audio Player */}
              <div className="mb-6">
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${embedId}?start=3&autoplay=${isPlaying ? 1 : 0}&loop=1&playlist=${embedId}&controls=1&modestbranding=1&rel=0&volume=${volume[0]}`}
                  title="Audio Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg bg-black"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={togglePlay}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-700 text-white"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={toggleMute}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-700 text-white"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <div className="w-24">
                    <Slider
                      value={isMuted ? [0] : volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-8 text-right">
                    {isMuted ? 0 : volume[0]}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
