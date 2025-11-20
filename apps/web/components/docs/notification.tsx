"use client"
import { NotificationMenu } from "@workspace/ui/components/notification";

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
                { id: "personal-info", label: "Personal info" },
                { id: "account-security", label: "Account Security" },
                { id: "templates", label: "Templates" },
                { id: "manage-users", label: "Manage users" },
                { id: "settings", label: "Settings" },
            ]}
            onLogout={() => console.log("logout")}
        />
    );
}