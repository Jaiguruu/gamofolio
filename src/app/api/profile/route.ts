import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    let developer = await db.developerProfile.findFirst();
    
    if (!developer) {
      developer = await db.developerProfile.create({
        data: {
          name: 'Alex Developer',
          title: 'Full Stack Developer',
          bio: 'Passionate developer creating interactive web experiences with a love for game development and creative portfolios.',
          email: 'alex@example.com',
          github: 'https://github.com/alexdev',
          linkedin: 'https://linkedin.com/in/alexdev',
          website: 'https://alexdev.portfolio',
        },
      });
    }
    
    return NextResponse.json(developer);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
