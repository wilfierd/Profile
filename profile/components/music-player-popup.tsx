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
  const [thumbnailUrl, setThumbnailUrl] = useState("")

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
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Set initial thumbnail
  useEffect(() => {
    if (embedId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${embedId}/maxresdefault.jpg`)
    }
  }, [embedId])

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-16 h-12 rounded-sm bg-gray-800 hover:bg-gray-700 shadow-lg transition-all duration-200 hover:scale-105 relative overflow-hidden border border-gray-600"
      >
        <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 rounded-sm relative p-1">
          {/* Cassette tape housing */}
          <div className="w-full h-full bg-black rounded-sm relative">
            {/* Two spinning reels */}
            <div className="absolute top-1 left-1 w-3 h-3">
              <div
                className={`w-full h-full rounded-full border border-gray-400 bg-gray-600 ${isPlaying ? "animate-spin" : ""} transition-all duration-300`}
                style={{ animationDuration: "2s" }}
              >
                {/* Reel spokes */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                </div>
                <div className="absolute top-0 left-1/2 w-px h-1 bg-gray-400 transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-px h-1 bg-gray-400 transform -translate-x-1/2"></div>
                <div className="absolute left-0 top-1/2 w-1 h-px bg-gray-400 transform -translate-y-1/2"></div>
                <div className="absolute right-0 top-1/2 w-1 h-px bg-gray-400 transform -translate-y-1/2"></div>
              </div>
            </div>

            <div className="absolute top-1 right-1 w-3 h-3">
              <div
                className={`w-full h-full rounded-full border border-gray-400 bg-gray-600 ${isPlaying ? "animate-spin" : ""} transition-all duration-300`}
                style={{ animationDuration: "1.8s" }}
              >
                {/* Reel spokes */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                </div>
                <div className="absolute top-0 left-1/2 w-px h-1 bg-gray-400 transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-px h-1 bg-gray-400 transform -translate-x-1/2"></div>
                <div className="absolute left-0 top-1/2 w-1 h-px bg-gray-400 transform -translate-y-1/2"></div>
                <div className="absolute right-0 top-1/2 w-1 h-px bg-gray-400 transform -translate-y-1/2"></div>
              </div>
            </div>

            {/* Tape window */}
            <div className="absolute bottom-1 left-2 right-2 h-1 bg-gradient-to-r from-amber-900 to-amber-700 rounded-sm"></div>

            {/* Cassette label area */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-2 bg-gray-200 rounded-sm opacity-80">
              <div className="text-[4px] text-black text-center leading-none pt-0.5 font-mono">TAPE</div>
            </div>
          </div>
        </div>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <Card className="relative w-full max-w-4xl p-8 shadow-2xl border-2 bg-gradient-to-b from-gray-800 to-gray-900 border-gray-600">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-12 bg-black rounded-sm border border-gray-600 relative p-2">
                    {/* Left reel */}
                    <div className="absolute top-2 left-2 w-6 h-6">
                      <div
                        className={`w-full h-full rounded-full border-2 border-gray-400 bg-gray-600 ${isPlaying ? "animate-spin" : ""} transition-all duration-300`}
                        style={{ animationDuration: "3s" }}
                      >
                        <div className="absolute inset-1 rounded-full border border-gray-500">
                          <div className="absolute top-0 left-1/2 w-px h-2 bg-gray-300 transform -translate-x-1/2"></div>
                          <div className="absolute bottom-0 left-1/2 w-px h-2 bg-gray-300 transform -translate-x-1/2"></div>
                          <div className="absolute left-0 top-1/2 w-2 h-px bg-gray-300 transform -translate-y-1/2"></div>
                          <div className="absolute right-0 top-1/2 w-2 h-px bg-gray-300 transform -translate-y-1/2"></div>
                          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                      </div>
                    </div>

                    {/* Right reel */}
                    <div className="absolute top-2 right-2 w-6 h-6">
                      <div
                        className={`w-full h-full rounded-full border-2 border-gray-400 bg-gray-600 ${isPlaying ? "animate-spin" : ""} transition-all duration-300`}
                        style={{ animationDuration: "2.7s" }}
                      >
                        <div className="absolute inset-1 rounded-full border border-gray-500">
                          <div className="absolute top-0 left-1/2 w-px h-2 bg-gray-300 transform -translate-x-1/2"></div>
                          <div className="absolute bottom-0 left-1/2 w-px h-2 bg-gray-300 transform -translate-x-1/2"></div>
                          <div className="absolute left-0 top-1/2 w-2 h-px bg-gray-300 transform -translate-y-1/2"></div>
                          <div className="absolute right-0 top-1/2 w-2 h-px bg-gray-300 transform -translate-y-1/2"></div>
                          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                      </div>
                    </div>

                    {/* Tape mechanism */}
                    <div className="absolute bottom-1 left-3 right-3 h-1 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 rounded-sm"></div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">Vintage Cassette Player</h2>
                    <p className="text-gray-400">Classic Audio Experience</p>
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
                  variant="outline"
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  Load Tape
                </Button>
              </div>

              {/* Track Info */}
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-white text-lg truncate">{currentTitle}</h3>
                <p className="text-gray-400">Now Playing on Cassette</p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <Button
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
                  disabled={!embedId}
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg">
                <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-gray-600">
                  {isMuted || volume[0] === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Slider
                  value={isMuted ? [0] : volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-white font-mono w-12 text-right">{isMuted ? 0 : volume[0]}%</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
