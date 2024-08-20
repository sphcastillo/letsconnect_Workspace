'use client'

import Document from "@/components/Document";

function DocumentPage({
    params: { id },
} : {
    params: { 
        id: string 
    };
}) {
  return (
    <div>
        <Document id={id}/>
    </div>
  )
}
export default DocumentPage;