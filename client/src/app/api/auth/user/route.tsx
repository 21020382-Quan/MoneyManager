import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth, currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Get user's information
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new NextResponse('User not exist', { status: 404 });
  }

  let user = await prisma.user.findFirst({
    where: { clerkUserId: clerkUser.id }
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        name: clerkUser.fullName || '',
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.emailAddresses[0].emailAddress,
        createdAt: new Date(),
      }
    })
  }

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: 'http://localhost:3000/dashboard',
    },
  });

}