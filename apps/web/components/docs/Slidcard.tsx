import { Clock, Wind, Plus, MoveRight, Construction, Check } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

export const Slidcard = () => {
    return (
        <div className="flex justify-center items-center w-full h-full gap-4">
            <div className="w-80 min-h-80 md:min-h-80 lg:h-80 bg-neutral-50 relative overflow-hidden rounded-md">
                <Card className="w-full">
                    <Skeleton
                        desc="This is a sample description text for the card header component."
                        icon={<Check className="w-4 h-4 border-2 border-dashed border-neutral-600 rounded-full text-neutral-900 group-hover:border-green-400 group-hover:text-green-400 p-[1px]" />}
                        className={cn("bg-neutral-100 group perspective-distant shadow-2xl shadow-white hover:translate-y-0.5 duration-200 ease-in-out cursor-pointer",
                            "absolute bottom-20 left-2 z-10 max-w-[90%]")}
                        title="compagin Planner"
                        varient="success"
                        time="90s">
                        <Slider title="google adds" />
                        <Slider title="SaaS" />
                    </Skeleton>
                    <Skeleton
                        desc="This is a sample description text for the card header component."
                        icon={<MoveRight className="w-4 h-4 border-2 border-dashed border-neutral-500 rounded-full text-neutral-900 group-hover:border-red-400 group-hover:text-red-400 p-[1px]" />}
                        className={cn("bg-neutral-100/90 group perspective-distant shadow-2xl shadow-white hover:translate-y-0.5 duration-200 ease-in-out cursor-pointer",
                            "absolute bottom-36 left-2 z-9")}
                        title="Risk Analysis"
                        varient="danger"
                        time="120s"
                    />
                    <Skeleton
                        desc="This is a sample description text for the card header component."
                        icon={<Construction className="w-4 h-4 border-2 border-dashed border-neutral-500 rounded-full text-neutral-900 group-hover:border-yellow-700 group-hover:text-yellow-700  p-[1px]"/>}
                        className={cn("bg-neutral-200 group perspective-distant shadow-2xl shadow-amber-600 hover:translate-y-0.5 duration-200 ease-in-out cursor-pointer",
                            "absolute bottom-46 left-2 z-8")}
                        title="Issue Tracker"
                        varient="warning"
                        time="45s" />
                </Card>
                <CardFooter desc="Predbuilt Agents,Tuned to Your Workflows" icon={<Plus />} />
            </div>
        </div>
    );
};

export const Card = ({ children, className }: { children: React.ReactNode, className: string }) => {
    return (
        <div className={cn("", className)}>
            {children}
        </div>
    )
};

export const Skeleton = ({
    title,
    className,
    varient,
    time,
    icon,
    children,
    desc
}: {
    title: string;
    className?: string;
    varient: string,
    time: string,
    icon: React.ReactElement,
    children?: React.ReactNode,
    desc: string
}) => {
    return (
        <div className={cn("max-w-[85%] bg-neutral-200 md:h-28 my-auto shadow-lg mx-auto w-full rounded-lg border-netural-200 dark:border-netural-700", "mask-r-from-95% mask-b-from-20% mask-b-to-200% flex flex-col gap-2", className)} style={{ padding: 6, margin: "auto", transform: "rotateX(30deg) rotateY(-20deg) rotateZ(24deg) scale(1.1) " }}>
            <div className="text-sm flex gap-3 items-center relative">
                {icon}
                <span className="ml-2 text-sm font-medium text-black">{title}</span>
                <Badge
                    variant={varient}
                    className="ml-auto"
                    time={time}
                />
            </div>
            <p className="text-sm text-neutral-400/80">
                {desc}
            </p>
            <p className="w-full flex gap-2">
                {children}
            </p>
        </div>
    );
};

export const Slider = ({ title, className }: { title: string, className?: string }) => {
    return (
        <div className={cn("rounded-full p-2 bg-neutral-400 w-fit text-[10px] text-white mt-5", className)} style={{ padding: "2px 8px 2px 8px", marginTop: "5px" }}>
            {title}
        </div>
    )
};

export const Badge = ({ variant, className, time }: { variant: "danger" | "success" | "warning" | string; className?: string; time: string }) => {
    return (
        <div
            className={cn(
                "px-1 py-.5 border flex gap-[.5px] items-center w-fit rounded-full ml-auto",
                variant === "success"
                    ? "bg-green-200 text-green-800 border-green-600"
                    : variant === "danger"
                        ? "bg-red-400 text-white border-red-600"
                        : variant === "warning"
                            ? "bg-yellow-500 text-yellow-200 border-yellow-600"
                            : "bg-neutral-40 text-yellow-200"
                , className)}
            style={{ padding: "2px 4px" }}
        >
            <Clock className="w-3 h-3" />
            <Wind className="w-3 h-3" />
            <span className="text-xs font-regular">{time}</span>
        </div>
    );
};

export const CardFooter = ({ desc, icon }: { desc?: string, icon?: React.ReactElement }) => {
    return (
        <div className="w-full mx-auto h-20 absolute bottom-0 z-20  border-neutral-200 flex items-center justify-between pointer-events-none p-[0_14px_0_14px]" >
            <p className="w-3/2 text-md text-black font-semibold leading-tight text-balance">
                {desc}
            </p>
            <p className="w-fit h-fit border text-[.6px] text-neutral-700 rounded-full border-neutral-800 pointer-events-auto duration-300 cursor-pointer p-[.5] mr-2">
                {icon}
            </p>
        </div>
    );
};



