import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Check if developer profile exists, if not create sample data
    let developer = await db.developerProfile.findFirst();
    
    if (!developer) {
      developer = await db.developerProfile.create({
        data: {
          name: 'Alex Developer',
          title: 'Full Stack Developer',
          bio: 'Passionate developer creating interactive web experiences',
          email: 'alex@example.com',
          github: 'https://github.com/alexdev',
          linkedin: 'https://linkedin.com/in/alexdev',
          website: 'https://alexdev.portfolio',
        },
      });
      
      // Create sample projects
      await db.project.createMany({
        data: [
          {
            title: 'E-Commerce Platform',
            description: 'A full-stack e-commerce solution built with Next.js, Prisma, and Stripe. Features include real-time inventory, payment processing, and admin dashboard.',
            techStack: JSON.stringify(['Next.js', 'TypeScript', 'Prisma', 'Stripe', 'Tailwind CSS']),
            githubUrl: 'https://github.com/alexdev/ecommerce',
            liveUrl: 'https://ecommerce.alexdev.dev',
            featured: true,
            order: 1,
            positionX: 200,
            positionY: 250,
            buildingType: 'shop',
            developerId: developer.id,
          },
          {
            title: 'Task Management App',
            description: 'Real-time collaborative task management with drag-and-drop functionality. Built with Socket.io for real-time updates.',
            techStack: JSON.stringify(['React', 'Node.js', 'Socket.io', 'MongoDB', 'DnD Kit']),
            githubUrl: 'https://github.com/alexdev/taskapp',
            liveUrl: 'https://tasks.alexdev.dev',
            featured: true,
            order: 2,
            positionX: 550,
            positionY: 250,
            buildingType: 'workshop',
            developerId: developer.id,
          },
          {
            title: 'AI Chat Application',
            description: 'An intelligent chatbot powered by GPT-4 with context awareness and memory. Features streaming responses and conversation history.',
            techStack: JSON.stringify(['Next.js', 'OpenAI API', 'Tailwind CSS', 'Vercel AI SDK']),
            githubUrl: 'https://github.com/alexdev/aichat',
            liveUrl: 'https://ai.alexdev.dev',
            featured: true,
            order: 3,
            positionX: 300,
            positionY: 480,
            buildingType: 'tower',
            developerId: developer.id,
          },
          {
            title: 'Weather Dashboard',
            description: 'Beautiful weather application with 7-day forecasts, interactive maps, and location-based alerts.',
            techStack: JSON.stringify(['Vue.js', 'OpenWeather API', 'Mapbox', 'Chart.js']),
            githubUrl: 'https://github.com/alexdev/weather',
            order: 4,
            positionX: 150,
            positionY: 480,
            buildingType: 'house',
            developerId: developer.id,
          },
        ],
      });
      
      // Create sample skills
      await db.skill.createMany({
        data: [
          {
            name: 'React',
            category: 'Frontend',
            level: 5,
            description: 'Expert in React ecosystem including hooks, context, and performance optimization',
            yearsOfExp: 5,
            developerId: developer.id,
          },
          {
            name: 'TypeScript',
            category: 'Language',
            level: 5,
            description: 'Strong typing, generics, and advanced TypeScript patterns',
            yearsOfExp: 4,
            developerId: developer.id,
          },
          {
            name: 'Node.js',
            category: 'Backend',
            level: 4,
            description: 'RESTful APIs, Express, Fastify, and server-side JavaScript',
            yearsOfExp: 4,
            developerId: developer.id,
          },
          {
            name: 'Next.js',
            category: 'Framework',
            level: 5,
            description: 'App Router, Server Components, API routes, and deployment',
            yearsOfExp: 3,
            developerId: developer.id,
          },
          {
            name: 'PostgreSQL',
            category: 'Database',
            level: 4,
            description: 'Database design, optimization, and Prisma ORM',
            yearsOfExp: 4,
            developerId: developer.id,
          },
        ],
      });
    }
    
    const projects = await db.project.findMany({
      where: { developerId: developer.id },
      orderBy: { order: 'asc' },
    });
    
    // Parse techStack from JSON
    const parsedProjects = projects.map(project => ({
      ...project,
      techStack: JSON.parse(project.techStack),
    }));
    
    return NextResponse.json(parsedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
