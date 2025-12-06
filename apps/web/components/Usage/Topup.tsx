"use client"
import { NotificationMenu } from "@/components/docs/notification";
import { IconFolders, IconGear, IconLock, IconSquareKanban, IconUsers } from "nucleo-glass";

export default function Example() {
    return (
        <NotificationMenu
            avatarSrc="/img.png"
            userLabel="@email"
            userSubLabel="Personal"
            workspaces={[
                { id: "ws-1", label: "Aman Workspaces" },
            ]}
            onCreateWorkspace={() => console.log("create workspace")}
            menuItems={[
                { id: "personal-info", icon: <IconFolders size={12} />, label: "Personal info" },
                { id: "account-security", icon: <IconLock size={12} />, label: "Account Security" },
                { id: "templates", icon: <IconSquareKanban size={12} />, label: "Templates" },
                { id: "manage-users", icon: <IconUsers size={12} />, label: "Manage users" },
                { id: "settings", icon: <IconGear size={12} />, label: "Settings" },
            ]}
            onLogout={() => console.log("logout")}
        />
    );
}