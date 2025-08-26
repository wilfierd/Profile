"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react"

export function MusicPlayerPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([50])
  const [isMuted, setIsMuted] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState("https://youtu.be/0dHiDF_Kl7k?si=huSYa8_WLeCc7A6x")
  const [embedId, setEmbedId] = useState("0dHiDF_Kl7k")
  const [currentTitle, setCurrentTitle] = useState("Default Track")

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const handleUrlSubmit = () => {
    const videoId = extractVideoId(youtubeUrl)
    if (videoId) {
      setEmbedId(videoId)
      setCurrentTitle("YouTube Track")
    }
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
        className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border-2 border-white/20"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white drop-shadow-md" />
          ) : (
            <Play className="w-6 h-6 text-white drop-shadow-md ml-1" />
          )}
          
          {/* Animated music waves when playing */}
          {isPlaying && (
            <div className="absolute -right-1 -top-1 flex space-x-px">
              <div className="w-1 bg-white rounded-full animate-bounce" style={{ height: '4px', animationDelay: '0ms' }}></div>
              <div className="w-1 bg-white rounded-full animate-bounce" style={{ height: '6px', animationDelay: '150ms' }}></div>
              <div className="w-1 bg-white rounded-full animate-bounce" style={{ height: '4px', animationDelay: '300ms' }}></div>
            </div>
          )}
        </div>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <Card className="relative w-full max-w-5xl p-6 shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600">
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" />
                    )}
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

              {/* URL Input */}
              <div className="flex gap-3 mb-6">
                <Input
                  placeholder="Paste YouTube URL here..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                />
                <Button
                  onClick={handleUrlSubmit}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Load Video
                </Button>
              </div>

              {/* Video Player */}
              <div className="relative bg-black rounded-lg overflow-hidden mb-6">
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${embedId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
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
