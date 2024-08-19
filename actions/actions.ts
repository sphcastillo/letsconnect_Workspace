'use server';

import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument(){
    
    auth().protect();
    // get user details
    // Remember: have to update Type defintions for sessionClaims
    const { sessionClaims } = await auth();

    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
        title: "🆕 ThinkTank Document",
    });

    await adminDb
        .collection('users')
        .doc(sessionClaims?.email!)
        .collection('rooms')
        .doc(docRef.id)
        .set({
        userId: sessionClaims?.email!,
        role: 'owner',
        createdAt: new Date(),
        roomId: docRef.id,
    });

    return { docId: docRef.id };
}