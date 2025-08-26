"use client"

import { useState, useRef, useEffect } from "react"
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
  const audioRef = useRef<HTMLIFrameElement>(null)
  const youtubeUrl = "https://youtu.be/0dHiDF_Kl7k"
  const embedId = "0dHiDF_Kl7k"

  const handleTrackClick = () => {
    window.open(youtubeUrl, '_blank')
  }

  const togglePlay = () => {
    const newPlayState = !isPlaying
    setIsPlaying(newPlayState)
    
    // Update the iframe src to control playback
    if (audioRef.current) {
      const baseUrl = `https://www.youtube.com/embed/${embedId}`
      const params = new URLSearchParams({
        autoplay: newPlayState ? '1' : '0',
        loop: '1',
        playlist: embedId,
        controls: '0',
        modestbranding: '1',
        rel: '0',
        start: '3',
        volume: (isMuted ? 0 : volume[0]).toString()
      })
      audioRef.current.src = `${baseUrl}?${params.toString()}`
    }
  }

  const toggleMute = () => {
    const newMuteState = !isMuted
    setIsMuted(newMuteState)
    
    // Update iframe with new mute state
    if (audioRef.current && isPlaying) {
      const baseUrl = `https://www.youtube.com/embed/${embedId}`
      const params = new URLSearchParams({
        autoplay: '1',
        loop: '1',
        playlist: embedId,
        controls: '0',
        modestbranding: '1',
        rel: '0',
        start: '3',
        volume: (newMuteState ? 0 : volume[0]).toString()
      })
      audioRef.current.src = `${baseUrl}?${params.toString()}`
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume)
    
    // Update iframe with new volume
    if (audioRef.current && isPlaying) {
      const baseUrl = `https://www.youtube.com/embed/${embedId}`
      const params = new URLSearchParams({
        autoplay: '1',
        loop: '1',
        playlist: embedId,
        controls: '0',
        modestbranding: '1',
        rel: '0',
        start: '3',
        volume: (isMuted ? 0 : newVolume[0]).toString()
      })
      audioRef.current.src = `${baseUrl}?${params.toString()}`
    }
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

          <Card className="relative w-full max-w-md mx-auto p-6 shadow-2xl bg-gray-900 border border-gray-600">
            <div className="relative z-10 text-center">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto">
                    <Music className="w-6 h-6 text-gray-300" />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-gray-700 text-white absolute top-0 right-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Track Info */}
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-white mb-2">Music Player</h2>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p 
                    className="text-gray-300 cursor-pointer hover:text-white transition-colors font-medium"
                    onClick={handleTrackClick}
                    title="Click to open on YouTube"
                  >
                    {currentTitle}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Click to view on YouTube</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={togglePlay}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-700 text-white"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>

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
                        onValueChange={handleVolumeChange}
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
            </div>
          </Card>

          {/* Hidden audio player */}
          <iframe
            ref={audioRef}
            width="1"
            height="1"
            src=""
            title="Background Music"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ opacity: 0, position: 'absolute', pointerEvents: 'none', left: '-9999px' }}
          />
        </div>
      )}
    </>
  )
}
