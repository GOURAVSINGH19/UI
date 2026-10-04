import { Icons, NextjsIcon } from '@workspace/ui/components/ui/icons';
import React from 'react';
import { cn } from '@workspace/ui/lib/utils';

const stack = [
    // The Next.js mark is white-on-black, so it carries its own circle.
    { name: 'Next.js', Icon: NextjsIcon, iconClassName: 'rounded-full bg-black' },
    { name: 'Tailwind CSS', Icon: Icons.tailwind },
    { name: 'Motion', Icon: Icons.v0 },
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
                        <Icon className={cn("size-3.5 text-ui-heading", iconClassName)} aria-hidden="true" />
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    );
};
