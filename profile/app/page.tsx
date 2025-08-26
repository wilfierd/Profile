import { ProfileHeader } from "@/components/profile-header"
import { MusicPlayerPopup } from "@/components/music-player-popup"
import { GitHubContributions } from "@/components/github-contributions"
import { SnakeGame } from "@/components/snake-game"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 relative">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20 blur-sm"
        style={{
          backgroundImage: "url('https://img.youtube.com/vi/0dHiDF_Kl7k/maxresdefault.jpg')",
          zIndex: -1,
        }}
      />

      <div className="fixed inset-0 bg-black/40" style={{ zIndex: -1 }} />

      <div className="fixed top-4 left-4 z-50">
        <MusicPlayerPopup />
      </div>

      {/* Hidden audio player for background music */}
      <div className="hidden">
        <iframe
          width="1"
          height="1"
          src="https://www.youtube.com/embed/0dHiDF_Kl7k?autoplay=1&loop=1&playlist=0dHiDF_Kl7k&controls=0&mute=0&volume=30"
          title="Background Music"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
        />
      </div>

      <div className="p-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Centered Single Row Layout - All components in one horizontal row */}
          <div className="flex flex-col lg:flex-row items-start justify-center gap-8 mb-8">
            <div className="w-full lg:w-1/3 flex justify-center">
              <ProfileHeader />
            </div>
            <div className="w-full lg:w-1/3">
              <GitHubContributions />
            </div>
            <div className="w-full lg:w-1/3">
              <SnakeGame />
            </div>
          </div>

          <footer className="mt-12 pt-8 border-t border-border">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Built with Next.js, Tailwind CSS, and lots of ☕</p>
              <p className="text-xs text-muted-foreground">© 2024 Your Personal Profile. Made with v0.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
