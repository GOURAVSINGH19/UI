import { Icons, NextjsIcon } from '@workspace/ui/components/ui/icons';
import React from 'react';
import { cn } from '@workspace/ui/lib/utils';

type StackItem = {
    name: string;
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconClassName?: string;
};

const stack: StackItem[] = [
    // The Next.js mark is white-on-black, so it carries its own circle.
    { name: 'Next.js', Icon: NextjsIcon, iconClassName: 'rounded-full bg-black' },
    { name: 'React 19', Icon: Icons.react, iconClassName: 'text-sky-500' },
    { name: 'Tailwind CSS', Icon: Icons.tailwind, iconClassName: 'text-sky-500' },
    // No Motion mark in the icon set, so it gets the same serif monogram as the Resources grid.
    { name: 'Motion' },
    { name: 'TypeScript', Icon: Icons.ts, iconClassName: 'text-[#3178C6]' },
];

export const Techsection: React.FC = () => {
    return (
        <div>
            <p className="text-xs text-ui-caption">Built with</p>
            <ul className="mt-3 flex flex-wrap gap-2">
                {stack.map(({ name, Icon, iconClassName }) => (
                    <li
                        key={name}
                        className="flex items-center gap-2 rounded-full border border-ui-border px-3 py-1 text-sm text-ui-secondary"
                    >
                        {Icon ? (
                            <Icon className={cn("size-3.5 text-ui-heading", iconClassName)} aria-hidden="true" />
                        ) : (
                            <span aria-hidden="true" className="flex size-3.5 items-center justify-center font-serif text-sm leading-none text-ui-heading italic">
                                {name.charAt(0)}
                            </span>
                        )}
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    );
};
