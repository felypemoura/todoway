'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getAllGroups() {
    try {
        const session = await auth();
        if (!session) {
            throw new Error("Unauthorized");
        }

        const groups = await prisma.group.findMany({
            where: {
                userId: session.user?.id || '',
            },
            include: {
                todos: true,
            },
        });
        return groups;
    } catch (error) {
        console.error("Error fetching groups: ", error);
        throw new Error("Could not fetch groups");
    }
}

export async function createGroup(name: string) {
    try {
        const session = await auth();
        if (!session) {
            throw new Error("Unauthorized");
        }

        let countGroups = await prisma.group.count({
            where: {
                userId: session.user?.id
            }
        });

        if(countGroups >= 5) {
            throw new Error("Group Limit Reached: You have reached the maximum limit of 5 groups.");
        } else {
            const newGroup = await prisma.group.create({
                data: {
                    name,
                    userId: session.user?.id || '',
                },
            });
            return newGroup;
        }
    } catch (error) {
        console.error("Error creating group: ", error);
        throw new Error("Could not create group");
    }
}

export async function deleteGroup(groupId: string) {
    try {
        const session = await auth();
        if (!session) {
            throw new Error("Unauthorized");
        }

        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
                userId: session.user?.id || '',
            },
        });

        if (!group) {
            throw new Error("Group not found or you do not have permission to delete this group.");
        }

        await prisma.group.delete({
            where: {
                id: groupId,
            },
        });

        return { message: "Group deleted successfully" };
    } catch (error) {
        console.error("Error deleting group: ", error);
        throw new Error("Could not delete group");
    }
}

export async function createTodo(groupId: string, title: string, description: string | null) {
    try {
        const session = await auth();
        if (!session) {
            throw new Error("Unauthorized");
        }

        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        if (!group || group.userId !== session.user?.id) {
            throw new Error("Group not found or you do not have permission to add a todo to this group.");
        }

        const newTodo = await prisma.todo.create({
            data: {
                title,
                description,
                completed: false,
                groupId,
            },
        });

        return newTodo;
    } catch (error) {
        console.error("Error creating todo: ", error);
        throw new Error("Could not create todo");
    }
}

export async function deleteTodo(todoId: string) {
    try {
        const session = await auth();
        if (!session) {
            throw new Error("Unauthorized");
        }

        const todo = await prisma.todo.findUnique({
            where: {
                id: todoId,
            },
        });

        if (!todo) {
            throw new Error("Todo not found");
        }

        const group = await prisma.group.findUnique({
            where: {
                id: todo.groupId || '',
            },
        });

        if (!group || group.userId !== session.user?.id) {
            throw new Error("You do not have permission to delete this todo.");
        }

        await prisma.todo.delete({
            where: {
                id: todoId,
            },
        });

        return { message: "Todo deleted successfully" };
    } catch (error) {
        console.error("Error deleting todo: ", error);
        throw new Error("Could not delete todo");
    }
}



export async function markTodoAsDone(todoId: string) {
    try {
        const session = await auth();
        if (!session) {
            throw new Error("Unauthorized");
        }

        const todo = await prisma.todo.findUnique({
            where: {
                id: todoId,
            },
        });

        if (!todo) {
            throw new Error("Todo not found");
        }

        const group = await prisma.group.findUnique({
            where: {
                id: todo.groupId || '',
            },
        });

        if (!group || group.userId !== session.user?.id) {
            throw new Error("You do not have permission to mark this todo as done.");
        }

        await prisma.todo.update({
            where: {
                id: todoId,
            },
            data: {
                completed: true,
            },
        });

        return { message: "Todo marked as done successfully" };
    } catch (error) {
        console.error("Error marking todo as done: ", error);
        throw new Error("Could not mark todo as done");
    }
}