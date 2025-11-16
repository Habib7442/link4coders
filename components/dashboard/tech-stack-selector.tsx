'use client'

import { useState } from 'react'
import Image from 'next/image'

interface TechStack {
  id: string
  name: string
  imagePath: string
  category: string
  color: string
}

interface Category {
  id: string
  name: string
}

const techStacksData: { techStacks: TechStack[]; categories: Category[] } = {
  "techStacks": [
    {
      "id": "angular",
      "name": "Angular",
      "imagePath": "/techstacks/angular.png",
      "category": "frontend",
      "color": "#DD0031"
    },
    {
      "id": "django",
      "name": "Django",
      "imagePath": "/techstacks/django.png",
      "category": "backend",
      "color": "#092E20"
    },
    {
      "id": "expo",
      "name": "Expo",
      "imagePath": "/techstacks/expo.png",
      "category": "mobile",
      "color": "#000020"
    },
    {
      "id": "firebase",
      "name": "Firebase",
      "imagePath": "/techstacks/firebase.png",
      "category": "backend",
      "color": "#FFCA28"
    },
    {
      "id": "flutter",
      "name": "Flutter",
      "imagePath": "/techstacks/flutter.png",
      "category": "mobile",
      "color": "#02569B"
    },
    {
      "id": "mysql",
      "name": "MySQL",
      "imagePath": "/techstacks/mysql.png",
      "category": "database",
      "color": "#4479A1"
    },
    {
      "id": "next",
      "name": "Next.js",
      "imagePath": "/techstacks/next.png",
      "category": "frontend",
      "color": "#000000"
    },
    {
      "id": "nodejs",
      "name": "Node.js",
      "imagePath": "/techstacks/nodejs.png",
      "category": "backend",
      "color": "#339933"
    },
    {
      "id": "nuxt",
      "name": "Nuxt.js",
      "imagePath": "/techstacks/nuxt.png",
      "category": "frontend",
      "color": "#00C58E"
    },
    {
      "id": "postgresql",
      "name": "PostgreSQL",
      "imagePath": "/techstacks/postgresql.png",
      "category": "database",
      "color": "#336791"
    },
    {
      "id": "react-native",
      "name": "React Native",
      "imagePath": "/techstacks/react-native.png",
      "category": "mobile",
      "color": "#61DAFB"
    },
    {
      "id": "react",
      "name": "React",
      "imagePath": "/techstacks/react.png",
      "category": "frontend",
      "color": "#61DAFB"
    },
    {
      "id": "redis",
      "name": "Redis",
      "imagePath": "/techstacks/redis.png",
      "category": "database",
      "color": "#DC382D"
    },
    {
      "id": "redux",
      "name": "Redux",
      "imagePath": "/techstacks/redux.png",
      "category": "frontend",
      "color": "#764ABC"
    },
    {
      "id": "springboot",
      "name": "Spring Boot",
      "imagePath": "/techstacks/springboot.png",
      "category": "backend",
      "color": "#6DB33F"
    },
    {
      "id": "supabase",
      "name": "Supabase",
      "imagePath": "/techstacks/supabase.png",
      "category": "backend",
      "color": "#3ECF8E"
    },
    {
      "id": "svelte",
      "name": "Svelte",
      "imagePath": "/techstacks/svelete.png",
      "category": "frontend",
      "color": "#FF3E00"
    },
    {
      "id": "tailwind",
      "name": "Tailwind CSS",
      "imagePath": "/techstacks/tailwind.png",
      "category": "frontend",
      "color": "#06B6D4"
    },
    {
      "id": "vue",
      "name": "Vue.js",
      "imagePath": "/techstacks/vue.png",
      "category": "frontend",
      "color": "#4FC08D"
    }
  ],
  "categories": [
    {
      "id": "frontend",
      "name": "Frontend"
    },
    {
      "id": "backend",
      "name": "Backend"
    },
    {
      "id": "mobile",
      "name": "Mobile"
    },
    {
      "id": "database",
      "name": "Database"
    }
  ]
}

interface TechStackSelectorProps {
  selectedTechStacks: string[]
  onChange: (selectedTechStacks: string[]) => void
}

export function TechStackSelector({ selectedTechStacks, onChange }: TechStackSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('frontend')

  // Get unique categories from tech stacks
  const categories = techStacksData.categories

  // Filter tech stacks by category
  const filteredTechStacks = techStacksData.techStacks.filter(
    (tech) => tech.category === selectedCategory
  )

  // Toggle tech stack selection
  const handleTechStackToggle = (techId: string) => {
    if (selectedTechStacks.includes(techId)) {
      onChange(selectedTechStacks.filter((id) => id !== techId))
    } else {
      onChange([...selectedTechStacks, techId])
    }
  }

  return (
    <div className="space-y-4">
      {/* Selected Tech Stacks Display */}
      {selectedTechStacks.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-[#28282b] rounded-lg">
          {selectedTechStacks.map((techId) => {
            const tech = techStacksData.techStacks.find(t => t.id === techId)
            return tech ? (
              <div 
                key={tech.id} 
                className="flex items-center gap-2 px-3 py-1 bg-[#33373b] rounded-full"
              >
                <Image 
                  src={tech.imagePath} 
                  alt={tech.name} 
                  width={20} 
                  height={20} 
                  className="rounded-sm"
                />
                <span className="text-[12px] text-white">{tech.name}</span>
                <button
                  type="button" 
                  onClick={() => handleTechStackToggle(tech.id)}
                  className="text-[#7a7a83] hover:text-white"
                >
                  ×
                </button>
              </div>
            ) : null
          })}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            type="button"
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 text-[12px] rounded-full transition-colors ${
              selectedCategory === category.id
                ? 'bg-[#54E0FF] text-[#18181a]'
                : 'bg-[#28282b] text-[#7a7a83] hover:text-white'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Tech Stacks Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {filteredTechStacks.map((tech) => (
          <button
            type="button"
            key={tech.id}
            onClick={() => handleTechStackToggle(tech.id)}
            className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
              selectedTechStacks.includes(tech.id)
                ? 'border-[#54E0FF] bg-[#54E0FF]/10'
                : 'border-[#33373b] bg-[#28282b] hover:border-[#54E0FF]/50'
            }`}
          >
            <div className="relative w-8 h-8 mb-2">
              <Image 
                src={tech.imagePath} 
                alt={tech.name} 
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <span className="text-[11px] text-center text-white truncate w-full">
              {tech.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}