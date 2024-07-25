'use client'

import { SquareCheckBig, LogIn, Plus } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import Image from "next/image";

import { useSession } from "next-auth/react";
import { GroupAdd } from "./create-group-sheet";

export function Header() {
    const { data: session } = useSession()

    if(session) {
        return (
            <header className="flex items-center justify-between p-5">
              <div className="flex items-center gap-2">
                <SquareCheckBig color="#dc2626"/>
                <span className="font-medium text-xl">TodoWay</span>
              </div>
              <div className="flex items-center gap-2">
                <GroupAdd/>
                <Image 
                  src={session.user?.image || ''} 
                  alt={session.user?.name || ''} 
                  height={37} 
                  width={37}
                  className="rounded-md"
                />
              </div>
            </header>
        )
    }

    return (
        <header className="flex items-center justify-between p-5">
            <div className="flex items-center gap-2">
              <SquareCheckBig color="#dc2626"/>
              <span className="font-medium text-xl">TodoWay</span>
            </div>
            <div>
              <Button 
                className="flex items-center gap-2"
                onClick={() => signIn('google')}
              >
                <LogIn size={20} />
                <span>Sign in</span>
              </Button>
            </div>
        </header>
    )
}