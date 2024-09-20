import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import liveblocks from "@/lib/liveblocks";
import { adminDb } from "@/firebase-admin";

export async function POST(req: NextRequest) {
  // Get authentication details
  const { userId, sessionClaims } = await auth();

  if (!userId || !sessionClaims) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
  }

  try {
    const { room } = await req.json();

    // Prepare liveblocks session
    const session = liveblocks.prepareSession(sessionClaims.email, {
      userInfo: {
        name: sessionClaims.fullName || "Anonymous",
        email: sessionClaims.email,
        avatar: sessionClaims.image || "",
      },
    });

    // Check if the user is in the specified room
    const usersInRoom = await adminDb
      .collectionGroup('rooms')
      .where("userId", "==", sessionClaims.email)
      .get();

    const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

    if (userInRoom?.exists) {
      // Authorize access
      session.allow(room, session.FULL_ACCESS);
      const { body, status } = await session.authorize();

      console.log("You are authorized to access this room");
      return new NextResponse(body, { status });
    } else {
      return NextResponse.json({ message: "You are not in this room" }, { status: 403 });
    }
  } catch (error) {
    console.error("Error processing request", error);
    return NextResponse.json({ message: "Error processing request" }, { status: 500 });
  }
}
