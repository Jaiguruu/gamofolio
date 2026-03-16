import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const developer = await db.developerProfile.findFirst();
    
    if (!developer) {
      return NextResponse.json([]);
    }
    
    const npcs = await db.nPC.findMany({
      where: { developerId: developer.id },
      include: {
        dialogues: {
          orderBy: { order: 'asc' },
        },
      },
    });
    
    // Transform dialogues from JSON strings to arrays
    const transformedNpcs = npcs.map(npc => ({
      ...npc,
      dialogues: npc.dialogues.map(d => ({
        ...d,
        lines: JSON.parse(d.lines),
      })),
    }));
    
    // If no NPCs exist, return default NPCs
    if (transformedNpcs.length === 0) {
      return NextResponse.json([
        {
          id: 'default-npc-1',
          name: 'Tech Mentor',
          type: 'skill_mentor',
          spriteKey: 'npc_mentor',
          positionX: 500,
          positionY: 150,
          dialogues: [
            { lines: [
              { text: "Welcome, traveler! I'm the Tech Mentor.", emotion: 'happy' },
              { text: 'I see you\'re interested in my skills. Let me share my expertise with you.', emotion: 'neutral' },
              { text: 'I specialize in React, TypeScript, Node.js, and modern web technologies.', emotion: 'excited' },
              { text: 'Feel free to explore the buildings around here to see my projects!', emotion: 'happy' },
            ]},
          ],
        },
        {
          id: 'default-npc-2',
          name: 'Guide Luna',
          type: 'about_me',
          spriteKey: 'npc_tech',
          positionX: 150,
          positionY: 350,
          dialogues: [
            { lines: [
              { text: "Hello there! I'm Luna, your guide.", emotion: 'happy' },
              { text: 'I\'m a passionate full-stack developer with 5+ years of experience.', emotion: 'neutral' },
              { text: 'I love building interactive experiences and beautiful user interfaces.', emotion: 'excited' },
              { text: 'This world represents my journey and projects. Enjoy exploring!', emotion: 'happy' },
            ]},
          ],
        },
      ]);
    }
    
    return NextResponse.json(transformedNpcs);
  } catch (error) {
    console.error('Error fetching NPCs:', error);
    return NextResponse.json({ error: 'Failed to fetch NPCs' }, { status: 500 });
  }
}
