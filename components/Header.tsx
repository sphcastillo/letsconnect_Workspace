"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import { Playpen_Sans, Poppins } from "next/font/google";

const playpenSans = Playpen_Sans({
  subsets: ["latin"],
});

const poppins_thin = Poppins({
  weight: "300",
  subsets: ["latin"],
});

const poppins_bold = Poppins({
  weight: "500",
  subsets: ["latin"],
});

function Header() {
  const { user } = useUser();
  return (
    <div className="flex items-center justify-between p-5">
      {user && (
        <Link href="/">
          <h1 className={`${playpenSans.className} text-2xl`}>
            {user?.firstName}
            {`'s`} ThinkTank
          </h1>
        </Link>
      )}
      <Breadcrumbs />
      <div>
        <SignedOut>
          <div className={`${poppins_thin.className} text-sm`}>
            <SignInButton />
          </div>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}

export default Header;
