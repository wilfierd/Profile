import { ProfileHeader } from "@/components/profile-header"
import { MusicPlayerPopup } from "@/components/music-player-popup"
import { GitHubContributions } from "@/components/github-contributions"
import { SnakeGame } from "@/components/snake-game"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 relative">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-30 blur-sm"
        style={{
          backgroundImage: "url('https://img.youtube.com/vi/0dHiDF_Kl7k/maxresdefault.jpg')",
          zIndex: -2,
        }}
      />

      <div className="fixed inset-0 bg-black/30" style={{ zIndex: -1 }} />

      <div className="fixed top-4 left-4 z-50">
        <MusicPlayerPopup />
      </div>

      <div className="p-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Single Column Layout - All components stacked vertically */}
          <div className="space-y-8">
            {/* Profile Section */}
            <div className="flex justify-center">
              <ProfileHeader />
            </div>
            
            {/* GitHub Contributions Section */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-3xl">
                <GitHubContributions />
              </div>
            </div>
            
            {/* Snake Game Section */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-3xl">
                <SnakeGame />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
