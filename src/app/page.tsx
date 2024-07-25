'use client'

import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { LogIn, Plus, SquareCheckBig } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useSession, signIn, signOut } from "next-auth/react";
import { ModeToggle } from "@/components/toggle-mode";
import { Header } from "@/components/header";
import { GroupAccordion } from "@/components/group-accordion";

export default function Home() {
  const { data: session } = useSession()

  if(session) {
    return (
      <main className="flex h-screen items-center justify-center max-sm:items-start">
        <Card className="w-[30rem] h-[30rem] max-sm:border-none max-sm:w-full">
          <Header/>
          <Separator className="w-full" />
          <CardContent>
            <GroupAccordion/>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex h-screen items-center justify-center">
      <Card className="w-[30rem] h-[30rem]">
        <Header/>
        <Separator/>
        <CardContent className="flex items-center justify-center h-[calc(100%-60px)] w-full">
          <span className="text-muted-foreground">Please sign in to enjoy the full features of the tool.</span>
        </CardContent>
      </Card>
    </main>
  );
}