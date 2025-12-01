"use client"
import { NotificationMenu } from "@/components/docs/notification";
import { IconFolders, IconGear, IconLock, IconSquareKanban, IconUsers } from "nucleo-glass";

export default function Example() {
    return (
        <NotificationMenu
            avatarSrc="https://images.unsplash.com/photo-1760625525684-3564699070a5?auto=format&fit=crop&w=600&q=60"
            userLabel="@email"
            userSubLabel="Personal"
            workspaces={[
                { id: "ws-1", label: "Aman Workspaces" },
            ]}
            onCreateWorkspace={() => console.log("create workspace")}
            menuItems={[
                { id: "personal-info", icon: <IconFolders size={14} />, label: "Personal info" },
                { id: "account-security", icon: <IconLock size={14} />, label: "Account Security" },
                { id: "templates", icon: <IconSquareKanban />, label: "Templates" },
                { id: "manage-users", icon: <IconUsers />, label: "Manage users" },
                { id: "settings", icon: <IconGear />, label: "Settings" },
            ]}
            onLogout={() => console.log("logout")}
        />
    );
}