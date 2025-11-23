import { Icons, NextjsIcon } from '@workspace/ui/components/ui/icons';
import React from 'react';

export const Techsection: React.FC = () => {
    return (
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-20 mb-10 w-full p-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2 backdrop-blur-sm">
                <NextjsIcon className="size-4 text-neutral-200" aria-hidden="true" />
                <span className="text-sm font-medium">Next.js</span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2 backdrop-blur-sm">
                <Icons.tailwind
                    className="size-4 text-neutral-200"
                    aria-hidden="true"
                />
                <span className="text-sm font-medium">Tailwind CSS</span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2 backdrop-blur-sm">
                <Icons.v0 className="size-4 text-neutral-200" aria-hidden="true" />
                <span className="text-sm font-medium">Motion</span>
            </div>
        </div>
    );
};

