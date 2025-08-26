"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Music } from "lucide-react"

interface MusicPlayerProps {
  defaultUrl?: string
}

export function MusicPlayer({ defaultUrl = "" }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([50])
  const [isMuted, setIsMuted] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState(defaultUrl)
  const [embedId, setEmbedId] = useState("")
  const [currentTitle, setCurrentTitle] = useState("No track selected")
  const [isLoading, setIsLoading] = useState(false)

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const handleUrlSubmit = () => {
    const videoId = extractVideoId(youtubeUrl)
    if (videoId) {
      setIsLoading(true)
      setEmbedId(videoId)
      setCurrentTitle("Loading...")
      // In a real app, you'd fetch the video title from YouTube API
      setTimeout(() => {
        setCurrentTitle("YouTube Track")
        setIsLoading(false)
      }, 1000)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-card-foreground">Music Player</h2>
        {embedId && (
          <Badge variant={isPlaying ? "default" : "secondary"} className="ml-auto">
            {isPlaying ? "Playing" : "Paused"}
          </Badge>
        )}
      </div>

      {/* URL Input */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Paste YouTube URL here..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
        />
        <Button onClick={handleUrlSubmit} variant="outline" disabled={isLoading}>
          {isLoading ? "Loading..." : "Load"}
        </Button>
      </div>

      {/* YouTube Embed */}
      {embedId && (
        <div className="mb-4 rounded-lg overflow-hidden shadow-inner">
          <iframe
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${embedId}?enablejsapi=1&controls=0&modestbranding=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      )}

      {/* Track Info */}
      <div className="mb-4">
        <h3 className="font-medium text-card-foreground truncate">{currentTitle}</h3>
        <p className="text-sm text-muted-foreground">YouTube Player</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
          <SkipBack className="w-4 h-4" />
        </Button>

        <Button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
          disabled={!embedId}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-primary-foreground" />
          ) : (
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
          )}
        </Button>

        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={toggleMute} className="hover:bg-primary/10">
          {isMuted || volume[0] === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>

        <Slider value={isMuted ? [0] : volume} onValueChange={setVolume} max={100} step={1} className="flex-1" />

        <span className="text-sm text-muted-foreground w-8">{isMuted ? 0 : volume[0]}</span>
      </div>

      {!embedId && (
        <div className="mt-4 p-4 bg-muted rounded-lg text-center">
          <Music className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Paste a YouTube URL above to start listening to music</p>
          <p className="text-muted-foreground text-xs mt-1">Press Enter or click Load to begin</p>
        </div>
      )}
    </Card>
  )
}
