import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
    request: Request
  ) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const {email} = body;

        // If user is not logged in, return unauthorized
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // User cannot add themselves as a contact
        if (currentUser.email === email) {
            return new NextResponse('Cannot add yourself as a contact', { status: 400 });
        }

        // Fetch contact list of current user
        const contact_list = await prisma.user.findUnique({
            where: {
                id: currentUser.id
            },
            select: {
                contacts: true
            }
        });

        // Push email to contact list , if not already present
        if (!contact_list?.contacts.includes(email)) {
            await prisma.user.update({
                where: {
                    id: currentUser.id
                },
                data: {
                    contacts: {
                        push: email
                    }
                }
            });
        }

        console.log("Done");

    } catch (error: any) {
      console.log(error, 'ERROR_MESSAGES');
      return new NextResponse('InternalError', { status: 500 });
    }
  }