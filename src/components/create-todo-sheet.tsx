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
import { createTodo } from "@/actions"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/toaster"

interface TodoFormValues {
    title: string;
    description: string;
}

export function TodoAdd({ groupId }: { groupId: string }) {
    const router = useRouter()
    const { toast } = useToast()
    const { register, handleSubmit } = useForm<TodoFormValues>();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const onSubmit: SubmitHandler<TodoFormValues> = async (data) => {
        try {
            await createTodo(groupId, data.title, data.description);
            toast({
                title: "Success",
                description: "Todo created successfully",
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
            <SheetTrigger className="rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent w-full text-left">
                <span>Create todo</span>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                <SheetTitle>Create a new todo</SheetTitle>
                <SheetDescription>
                    Please provide a title and description for your new todo. You can always change this later.
                </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                    <Input 
                        {...register("title")}
                        placeholder="Todo Title"
                        required
                    />
                    <Input 
                        {...register("description")}
                        placeholder="Todo Description"
                        className="mt-2"
                    />
                    <Button type="submit" className="mt-2 w-full">
                        Create Todo
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    )
}