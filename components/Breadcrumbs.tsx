"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Handjet, Poppins  } from "next/font/google";

const handjet = Handjet({
  weight: '500',
  subsets: ['latin']
});

const poppins_thin = Poppins({
  weight: '300',
  subsets: ['latin']
});

const poppins_bold = Poppins({
  weight: '500',
  subsets: ['latin']
});

function Breadcrumbs() {
  const path = usePathname();
  const segments = path.split("/");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className={`${poppins_bold.className} tracking-wider text-sm`}>Home</BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          if (!segment) return null;

          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;

          // Replace the segment that represents the document ID (not 'doc')
          const isDocId = index > 0 && segments[index - 1] === "doc";

          return (
            <Fragment key={segment}>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                {isDocId ? (
                  <DocumentBreadcrumb segmentId={segment} />
                ) : isLast ? (
                  <BreadcrumbPage className={`${poppins_bold.className} tracking-wider text-sm`}>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className={`${poppins_bold.className} tracking-wider text-sm`} href={href}>{segment}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// Component to fetch and display document title from Firestore
function DocumentBreadcrumb({ segmentId }: { segmentId: string }) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", segmentId));

  if (loading) return <BreadcrumbPage>Loading...</BreadcrumbPage>;
  if (error || !data) return <BreadcrumbPage>Error</BreadcrumbPage>;

  return <BreadcrumbPage className={`${poppins_bold.className} tracking-wider text-sm`}>{data.title}</BreadcrumbPage>;
}

export default Breadcrumbs;
