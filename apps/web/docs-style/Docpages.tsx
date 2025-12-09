import { cn } from "@workspace/ui/lib/utils"

export const Overview = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className={cn("flex flex-col gap-2")}>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    )
}

export const Installation = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className={cn("flex flex-col gap-2")}>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    )
}

export const Preview = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className={cn("flex flex-col gap-2")}>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    )
}

export const Anatomy = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className={cn("flex flex-col gap-2")}>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    )
}

export const Customizing = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className={cn("flex flex-col gap-2")}>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    )
}

export const Tips = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className={cn("flex flex-col gap-2")}>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    )
}
