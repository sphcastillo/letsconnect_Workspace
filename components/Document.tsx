"use client";

import { Input } from "@/components/ui/input";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { PT_Sans, Poppins } from "next/font/google";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";

const poppins_thin = Poppins({
  weight: '300',
  subsets: ['latin']
});

const poppins_bold = Poppins({
  weight: '500',
  subsets: ['latin']
});

const ptSans = PT_Sans({
  weight: '400',
  subsets: ['latin']
});


function Document({ id }: { id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");

  const [isUpdating, startTransition] = useTransition();
  const isOwner = useOwner();

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };
  return (
    <div className="flex-1 h-full bg-white p-5">
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form 
            className="flex flex-1 space-x-2"
            onSubmit={updateTitle}
        >
          {/* update title of Doc */}
          <Input value={input} onChange={(e) => setInput(e.target.value)} className={poppins_thin.className} />
          <Button disabled={isUpdating} type="submit" className={`${ptSans.className} tracking-wider`}>
            {isUpdating ? "Updating..." : "Update"}
          </Button>

          {/* IF */}
          {isOwner && (
            <>
              <InviteUser />
              <DeleteDocument />
            </>
          )}

        </form>
      </div>

      <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
        {/* MangeUsers */}
        <ManageUsers />

        {/* Avatars */}
        <Avatars />
      </div>
      <hr className="pb-10"/>

      <Editor />
    </div>
  );
}
export default Document;
