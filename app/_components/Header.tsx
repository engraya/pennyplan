"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

function Header() {
  const { isSignedIn } = useUser();
  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <Link href="/">
      <div className="flex flex-row items-center">
        <Image src={"/pennyplan.svg"} alt="logo" width={40} height={25} />
        <span className="text-blue-800  font-bold text-xl">PennyPlan</span>
      </div>
      </Link>

      {isSignedIn ? (
        <UserButton />
      ) : (
        <div className="flex gap-3  items-center">

          <Link href={"/dashboard"}>
            <Button variant="outline" className="rounded-full">
              Dashboard
            </Button>
          </Link>
          <Link href={"/sign-in"}>
            <Button className="rounded-full">Get Started</Button>
          </Link>
          {/* <ThemeToggler/> */}
        </div>
      )}
    </div>
  );
}

export default Header;
