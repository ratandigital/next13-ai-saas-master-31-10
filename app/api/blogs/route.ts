import { NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { json } from 'stream/consumers';

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 10;

  const [totalPosts, posts] = await Promise.all([
    prismadb.testApiLimit .count(), // Get total number of posts
    prismadb.testApiLimit .findMany({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: { createdAt: 'desc' }, // Order by date
    }),
  ]);

  return NextResponse.json({ posts, totalPosts });
}