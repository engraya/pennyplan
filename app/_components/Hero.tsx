import React from "react";
import Link from "next/link";
import Image from "next/image"
import heroImage from "@/public/hero.jpg"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
function Hero() {


  return (
<section className="relatve">
  {/* Container */}
  <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
    {/* Heading Div */}
    <div className="mx-auto mb-12 w-full max-w-3xl text-center md:mb-16 lg:mb-20">
      <h1 className="mb-6 text-3xl font-semibold md:text-5xl">Take Control of your Finances with <span className="bg-[url('https://assets.website-files.com/63904f663019b0d8edf8d57c/6390526ac2a607693620c97b_Rectangle%2010.svg')] bg-cover bg-center px-4 text-white">PennyPlan</span>.</h1>
      <p className="mx-auto mb-5 max-w-[540px] text-xl text-[#636262] lg:mb-8">Manage your money effortlessly with PennyPlan, your all-in-one financial tracker that helps you budget smarter, save more, and grow your wealth. Powered by cutting-edge AI, PennyPlan gives you personalized financial advice tailored to your spending habits and savings goals. Whether you’re tracking expenses, managing budgets, or seeking guidance on investments, PennyPlan is here to help you build a secure financial future. With an intuitive interface and real-time insights, taking control of your finances has never been easier.</p>
      {/* Button Wrap */}
      <div className="flex justify-center">
          <SignedIn>
          <Link href="/dashboard" className="flex max-w-full flex-row items-center justify-center rounded-xl border border-solid border-[#1353fe] px-6 py-3 font-semibold text-[#1353fe] [box-shadow:rgb(19,_83,_254)_6px_6px]">
              <p className="text-black">Dashboard</p>
            </Link>
          </SignedIn>
          <SignedOut>
          <Link href="/sign-in" className="mr-5 inline-block rounded-xl bg-black px-8 py-4 text-center font-semibold text-white [box-shadow:rgb(19,_83,_254)_6px_6px] md:mr-6">Get Started</Link>
          </SignedOut>
      </div>
    </div>
    {/* Image Div */}
    <div className="relative mx-auto h-[512px]">
      <Image src={heroImage} width={500} height={500} alt="hero" className="inline-block h-full w-full rounded-xl object-cover sm:rounded-2xl" />
      <div className="absolute bottom-0 left-4 right-0 top-4 -z-10 h-full w-full rounded-2xl bg-black" />
    </div>
  </div>
  {/* BG Images */}
  <Image src="https://assets.website-files.com/63904f663019b0d8edf8d57c/63905b9f809b5c8180ce30c5_pattern-1.svg" width={70} height={70} alt="image1" className="absolute bottom-0 left-0 right-auto top-auto -z-10 inline-block md:bottom-1/2 md:left-0 md:right-auto md:top-auto" />
  <Image src="https://assets.website-files.com/63904f663019b0d8edf8d57c/63905ba1538296b3f50a905e_pattern-2.svg" width={70} height={70} alt="image2" className="absolute bottom-auto left-auto right-0 top-0 -z-10 hidden sm:inline-block" />
</section>

  );
}

export default Hero;
