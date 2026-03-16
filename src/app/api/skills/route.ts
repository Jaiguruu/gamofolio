import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const developer = await db.developerProfile.findFirst();
    
    if (!developer) {
      return NextResponse.json([]);
    }
    
    const skills = await db.skill.findMany({
      where: { developerId: developer.id },
      orderBy: [
        { category: 'asc' },
        { level: 'desc' },
      ],
    });
    
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}
