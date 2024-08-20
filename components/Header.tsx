"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { Breadcrumb } from "./ui/breadcrumb";
import Breadcrumbs from "./Breadcrumbs";

function Header() {
  const { user } = useUser();
  return (
    <div className="flex items-center justify-between p-5">
      {user && (
        <Link href="/">
          <h1 className="text-2xl">
            {user?.firstName}
            {`'s`} ThinkTank
          </h1>
        </Link>
      )}
      <Breadcrumbs />
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}

export default Header;
