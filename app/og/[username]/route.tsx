import { ImageResponse } from 'next/og';

export async function GET(request: Request, { params }: { params: { username: string } }) {
  // In a real app, this would be fetched from the database
  const user = {
    name: "Habib Tanwir Laskar",
    title: "Full-Stack Developer",
    avatar: "H"
  };

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(to bottom right, #FF6B35, #FF914D)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: 'white',
            marginBottom: 30,
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              color: '#FF6B35',
            }}
          >
            {user.avatar}
          </div>
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          {user.name}
        </div>
        <div
          style={{
            fontSize: 32,
            color: 'white',
            textAlign: 'center',
          }}
        >
          {user.title}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            fontSize: 20,
            color: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          link4coders.in
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}