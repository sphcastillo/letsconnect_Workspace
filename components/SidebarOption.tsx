import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Poppins, PT_Sans } from "next/font/google";

const poppins_thin = Poppins({
  weight: '300',
  subsets: ['latin']
});

const ptSans = PT_Sans({
  weight: '400',
  subsets: ['latin']
});

function SidebarOption({ href, id }: { href: string; id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const pathname = usePathname();
  const isActive = href.includes(pathname) && pathname !== "/";

  if (!data) return null;

  return (
    <Link
      href={href}
      className={`border p-2 rounded-md ${
        isActive ? "bg-gray-300 font-bold border-black hover:bg-blue-100 hover:text-yellow-300" : "border-gray-400"
      } 
            ${loading ? "animate-pulse" : ""}
            `}
    >
      <p className={`${ptSans.className} truncate`}>{data.title}</p>
    </Link>
  );
}
export default SidebarOption;
