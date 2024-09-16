import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowLeftCircle } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins_thin = Poppins({
  weight: '300',
  subsets: ['latin']
});

const poppins_bold = Poppins({
  weight: '500',
  subsets: ['latin']
});


export default function Home() {
  return (
    <main className="flex space-x-2 items-center animate-pulse">
      <ArrowLeftCircle className="w-12 h-12"/>
      <h1 className={`${poppins_bold.className}`}>Get started with creating a NEW ThinkTank Document</h1>
    </main>
  );
}
