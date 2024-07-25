import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"  
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useForm, SubmitHandler } from "react-hook-form"
import { createGroup } from "@/actions"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/toaster"

interface GroupFormValues {
    groupName: string;
}

export function GroupAdd() {
    const router = useRouter()
    const { toast } = useToast()
    const { register, handleSubmit } = useForm<GroupFormValues>();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const onSubmit: SubmitHandler<GroupFormValues> = async (data) => {
        try {
            await createGroup(data.groupName);
            toast({
                title: "Success",
                description: "Group created successfully",
            });
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
            });
        }
    };

    if (!isClient) {
        return null;
    }

    return (
        <Sheet>
            <SheetTrigger>
                <Button size="icon" className="flex items-center gap-2">
                    <Plus size={20} />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                <SheetTitle>Create a new group</SheetTitle>
                <SheetDescription>
                    Please provide a name for your new group. You can always change this later.
                </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                    <Input 
                        {...register("groupName")}
                        placeholder="Group Name"
                    />
                    <Button type="submit" className="mt-2 w-full">
                        Create Group
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    )
}