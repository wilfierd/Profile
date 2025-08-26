import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Phone, Facebook } from "lucide-react"
import Image from "next/image"

interface ProfileHeaderProps {
  name?: string
  title?: string
  profileImage?: string
  githubUrl?: string
  linkedinUrl?: string
  phoneNumber?: string
  facebookUrl?: string
}

export function ProfileHeader({
  name = "Wilfierd",
  title = "IT Student", // Reverted title back to IT Student
  profileImage = "/Profile/profile-avatar.jpg",
  githubUrl = "https://github.com/wilfierd",
  linkedinUrl = "https://www.linkedin.com/in/wilfierddevop/",
  phoneNumber = "+84971507528",
  facebookUrl = "https://www.facebook.com/nguyen.hieu.641586/",
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center lg:items-start space-y-6">
      <div className="relative group">
        <Image
          src={profileImage || "/placeholder.svg"}
          alt="Profile"
          width={200}
          height={200}
          className="rounded-full border-4 border-primary/20 shadow-lg transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-background rounded-full animate-pulse" />
      </div>

      <div className="text-center lg:text-left space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">{name}</h1>{" "}
          {/* Made header brighter with white text and drop shadow */}
          <p className="text-gray-200 text-lg mb-3 drop-shadow">{title}</p> {/* Made subtitle brighter */}
          <p className="text-gray-300 text-sm mb-3 drop-shadow">
            Interested in coding, cloud, and tech news. Also enjoys music.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
          <Badge variant="secondary" className="text-xs">
            Software Developer {/* Moved Software Developer to tech stack */}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Golang
          </Badge>
          <Badge variant="secondary" className="text-xs">
            TypeScript
          </Badge>
        </div>

        <div className="flex gap-3 justify-center lg:justify-start">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" // Better hover colors
            asChild
          >
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" // Better hover colors
            asChild
          >
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" // Better hover colors
            asChild
          >
            <a href={`tel:${phoneNumber}`}>
              <Phone className="w-4 h-4" />
              Phone
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" // Better hover colors
            asChild
          >
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
              <Facebook className="w-4 h-4" />
              Facebook
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
