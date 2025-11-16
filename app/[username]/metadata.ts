import type { Metadata } from 'next';

export function generateMetadata({ params }: { params: { username: string } }): Metadata {
  // In a real app, this would be fetched from the database
  const user = {
    name: "Habib Tanwir Laskar",
    title: "Full-Stack Developer",
    bio: "I build scalable web applications with React, Node.js, and cloud technologies. Passionate about creating beautiful, functional user experiences.",
    avatar: "https://link4coders.in/avatar/habib.jpg"
  };

  return {
    title: `${user.name} - ${user.title} | Link4Coders`,
    description: user.bio,
    openGraph: {
      title: `${user.name} - ${user.title}`,
      description: user.bio,
      images: [
        {
          url: user.avatar,
          width: 400,
          height: 400,
          alt: `${user.name}'s avatar`
        }
      ]
    },
    twitter: {
      card: 'summary',
      title: `${user.name} - ${user.title}`,
      description: user.bio,
      images: [user.avatar]
    }
  };
}