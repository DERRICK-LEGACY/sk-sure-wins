import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'sk-sure-wins-super-secret-key-2026');
const USER_COOKIE = "sk_user_session";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(USER_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.sub || typeof payload.sub !== 'string') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = payload.sub;

    // Check if user has an active subscription to the Book package
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          include: { package: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hasBook = user.subscriptions.some(sub => sub.package.name.includes("Book:"));

    if (!hasBook) {
      return NextResponse.json({ error: 'You have not purchased this book.' }, { status: 403 });
    }

    // Serve the file
    const filePath = path.join(process.cwd(), 'private', 'AMAZIMA_AMAKUSIKE.docx');
    
    if (!fs.existsSync(filePath)) {
      console.error("Book file not found at path:", filePath);
      return NextResponse.json({ error: 'Book file not found on server' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="AMAZIMA_AMAKUSIKE.docx"',
      },
    });

  } catch (error) {
    console.error("Error downloading book:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
