'use client'
import { MenuIcon } from "lucide-react";
import NewDocumentButton from "./NewDocumentButton";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { collectionGroup, query, where, DocumentData } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import SidebarOption from "./SidebarOption";

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: 'owner' | 'editor' | 'viewer';
  roomId: string;
  userId: string;
}

function Sidebar() {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
    viewer: RoomDocument[];
  }>({
    owner: [],
    editor: [],
    viewer: [],
  });

  const [data, loading, error] = useCollection(
    user && 
    query(
      collectionGroup(db, 'rooms'),
      where('userId', '==', user.emailAddresses[0].toString())
    )
  );

  useEffect(() => {
    if(!data) return;
    // reshape the data
    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
      viewer: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;

        if(roomData.role === 'owner'){
          acc.owner.push({
            id: curr.id,
            ...roomData,
          });
        }else if(roomData.role === 'editor'){
          acc.editor.push({
            id: curr.id,
            ...roomData,
          });
        }else{
          acc.viewer.push({
            id: curr.id,
            ...roomData,
          });
        }
        return acc;
      },
      { 
        owner: [], 
        editor: [], 
        viewer: [] 
      }
    );

    setGroupedData(grouped);

  }, [data]);

  const menuOptions = (
    <>
      <NewDocumentButton />

      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        {/* My Documents */}
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm">
            No ThinkTank documents found
          </h2>
        ) : (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              My ThinkTank Documents
            </h2>
            {groupedData.owner.map((doc) => (
              <SidebarOption 
                key={doc.id}
                id={doc.id}
                href={`/doc/${doc.id}`}
              />
            ))}
          </>
        )}
      </div>

      {/* Shared with Me as Editor */}
      {groupedData.editor.length > 0 && (
        <>
          <h2 className="text-gray-500 font-semibold text-sm">
            Shared with Me as Editor
          </h2>
          {groupedData.editor.map((doc) => (
            <SidebarOption 
              key={doc.id}
              id={doc.id}
              href={`/doc/${doc.id}`}
            />
          ))}
        </>
      )}

      {/* Shared with Me as Viewer */}
      {groupedData.viewer.length > 0 && (
        <>
          <h2 className="text-gray-500 font-semibold text-sm">
            Shared with Me as Viewer
          </h2>
          {groupedData.viewer.map((doc) => (
            <SidebarOption 
              key={doc.id}
              id={doc.id}
              href={`/doc/${doc.id}`}
            />
          ))}
        </>
      )}
    </>
  );

  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger>
                <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
                </SheetTrigger>
                <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>ThinkTank</SheetTitle>
                    <div>{menuOptions}</div>
                </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>

        <div className="hidden md:inline">
          {menuOptions}
        </div>
    </div>
  );
}
export default Sidebar;
