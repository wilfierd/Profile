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

      <div className="p-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Single Row Layout */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <ProfileHeader />
            <GitHubContributions />
          </div>

          <SnakeGame />

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
