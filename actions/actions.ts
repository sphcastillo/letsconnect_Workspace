'use server';

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
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

export async function deleteDocument(roomId: string){
    auth().protect();

    console.log("deleteDocument", roomId);

    try {
        // delete document reference tiself
        await adminDb.collection("documents").doc(roomId).delete();

        const query = await adminDb
            .collectionGroup('rooms')
            .where("roomId", "==", roomId)
            .get();

        const batch = adminDb.batch();

        // delete the room reference in the user's collection for every user in the room
        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        })

        await batch.commit();

        // delete the room in Liveblocks
        await liveblocks.deleteRoom(roomId);

        return { success: true };

    } catch(error){
        console.error("Error deleting document", error);
        return { success: false};
    }
}