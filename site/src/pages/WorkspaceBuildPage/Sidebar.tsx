import type { FC, HTMLAttributes } from "react";
import { cn } from "#/utils/cn";

export const Sidebar: FC<HTMLAttributes<HTMLElement>> = ({
	children,
	...attrs
}) => {
	return (
		<nav
			className={cn(
				"w-64 flex-shrink-0 border-solid border-0 border-r",
				"h-full py-2 overflow-y-auto",
			)}
			{...attrs}
		>
			{children}
		</nav>
	);
};

interface SidebarItemProps extends HTMLAttributes<HTMLElement> {
	active?: boolean;
}

export const SidebarItem: FC<SidebarItemProps> = ({
	children,
	active,
	...attrs
}) => {
	return (
		<button
			className={cn(
				"border-none text-sm w-full text-left px-6 py-2.5 cursor-pointer",
				active
					? "bg-surface-secondary text-content-primary pointer-events-none"
					: "bg-transparent text-content-secondary hover:bg-surface-tertiary hover:text-content-primary",
			)}
			{...attrs}
		>
			{children}
		</button>
	);
};

export const SidebarCaption: FC<HTMLAttributes<HTMLDivElement>> = ({
	children,
	...attrs
}) => {
	return (
		<div
			className="text-2xs uppercase font-medium text-content-secondary py-3 px-6 tracking-[0.5px]"
			{...attrs}
		>
			{children}
		</div>
	);
};
