import type { FC, HTMLAttributes, ReactNode } from "react";
import { cn } from "#/utils/cn";

export const HorizontalContainer: FC<HTMLAttributes<HTMLDivElement>> = ({
	className,
	...attrs
}) => {
	return (
		<div
			className={cn("flex flex-col gap-16 md:gap-20", className)}
			{...attrs}
		/>
	);
};

interface HorizontalSectionProps
	extends Omit<HTMLAttributes<HTMLElement>, "title"> {
	title: ReactNode;
	description: ReactNode;
	children?: ReactNode;
}

export const HorizontalSection: FC<HorizontalSectionProps> = ({
	children,
	title,
	description,
	className,
	...attrs
}) => {
	return (
		<section
			className={cn(
				"flex flex-col gap-4 lg:flex-row lg:gap-[120px]",
				className,
			)}
			{...attrs}
		>
			<div className="w-full shrink-0 top-6 max-w-[312px] md:sticky">
				<h2 className="text-[20px] text-content-primary font-normal m-0 mb-2 flex flex-row items-center gap-3">
					{title}
				</h2>
				<div className="text-[14px] text-content-secondary leading-[160%] m-0">
					{description}
				</div>
			</div>

			{children}
		</section>
	);
};
