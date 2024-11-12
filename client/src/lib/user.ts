
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export type User = {
  id: number
  clerkUserId: string
  email: string
  name: string | null
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export default async function getUser(): Promise<User|null> {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }
  let user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id }
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.emailAddresses[0].emailAddress,
      }
    })
  }
  return user;
}
