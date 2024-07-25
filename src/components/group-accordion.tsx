'use client'

import { Accordion, AccordionTrigger, AccordionItem, AccordionContent } from "./ui/accordion";
import { getAllGroups, deleteGroup, deleteTodo, markTodoAsDone } from "@/actions";
import { Ellipsis, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useToast } from "@/components/ui/toaster";
import { TodoAdd } from "./create-todo-sheet";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge";

interface Todo {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    groupId: string | null;
}

interface Group {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    todos: Todo[];
}

export function GroupAccordion() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchGroups() {
            try {
                const groupsData = await getAllGroups();
                setGroups(groupsData);
            } catch (error) {
                console.error("Failed to fetch groups", error);
            } finally {
                setLoading(false);
            }
        }

        fetchGroups();
    }, [groups]);

    const handleDeleteGroup = async (groupId: string) => {
        try {
            await deleteGroup(groupId);
            setGroups(groups.filter(group => group.id !== groupId));
            toast({
                title: "Success",
                description: "Group deleted successfully",
            });
        } catch (error) {
            console.error("Failed to delete group", error);
            toast({
                title: "Error",
                description: "Failed to delete group",
            });
        }
    };

    const handleDeleteTodo = async (todoId: string) => {
        try {
            await deleteTodo(todoId);
            setGroups(groups.map(group => ({
                ...group,
                todos: group.todos.filter(todo => todo.id !== todoId)
            })));
            toast({
                title: "Success",
                description: "Todo deleted successfully",
            });
        } catch (error) {
            console.error("Failed to delete todo", error);
            toast({
                title: "Error",
                description: "Failed to delete todo",
            });
        }
    };

    const handleMarkAsDone = async (todoId: string) => {
        try {
            await markTodoAsDone(todoId);
            setGroups(groups.map(group => ({
                ...group,
                todos: group.todos.map(todo => 
                    todo.id === todoId ? { ...todo, completed: true } : todo
                )
            })));
            toast({
                title: "Success",
                description: "Todo marked as done successfully",
            });
        } catch (error) {
            console.error("Failed to mark todo as done", error);
            toast({
                title: "Error",
                description: "Failed to mark todo as done",
            });
        }
    };

    if (loading) {
        return (
            <main className="flex py-[11rem] items-center justify-center">
                <div className="flex items-center justify-center h-[calc(100%-60px)] w-full">
                    <LoaderCircle color="#dc2626" className="animate-spin" />
                </div>
            </main>
        )
    }

    return (
        <Accordion type="multiple">
            {groups.map((group) => (
                <AccordionItem key={group.id} value={group.id} className="flex items-center justify-between w-full">
                    <div className="flex-grow">
                        <AccordionTrigger className="hover:no-underline w-full gap-2">
                            {group.name}
                        </AccordionTrigger>
                        <AccordionContent className="w-full">
                            {group.todos.map((todo) => (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="hover:bg-accent rounded-md p-3 mr-2 transition-all cursor-pointer flex items-center justify-between" key={todo.id}>
                                            <Badge variant={todo.completed ? "secondary" : "default"} className="ml-2">
                                                {todo.completed ? "Completed" : "Pending"}
                                            </Badge>
                                            {todo.title}
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{todo.title}</DialogTitle>
                                        </DialogHeader>
                                        <DialogDescription>
                                            {todo.description}
                                        </DialogDescription>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => handleDeleteTodo(todo.id)}>Delete</Button>
                                            <Button variant="outline" onClick={() => handleMarkAsDone(todo.id)}>Mark as done</Button>
                                            <Button>Save</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            ))}
                        </AccordionContent>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button size="icon" variant="outline">
                                <Ellipsis size={20} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem asChild>
                                <TodoAdd groupId={group.id} />
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log(`Edit group ${group.id}`)}>
                                Edit group
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteGroup(group.id)}>
                                Delete group
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </AccordionItem>
            ))}
        </Accordion>
    );
}