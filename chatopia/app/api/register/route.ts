import bcrypt from "bcryptjs";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  try {
    // Extracting form data
    const body = await request.json();
    const {
      email,
      name,
      password
    } = body;

    console.log('email', email);
    console.log('name', name);

    if (!email || !name || !password) {
      return new NextResponse('Missing info', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await prisma.user.findUnique({
      where: {email}
    });

    if(existingUser){
      return new NextResponse('User already exists', { status: 400 });
      // throw new Error('User already exists');
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword
      }
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.log(error, 'REGISTRATION_ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
};

