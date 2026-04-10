import { cn } from "#/utils/cn";

type StackProps = React.ComponentPropsWithRef<"div"> & {
	className?: string;
	direction?: "column" | "row";
	spacing?: number;
	alignItems?: React.CSSProperties["alignItems"];
	justifyContent?: React.CSSProperties["justifyContent"];
	wrap?: React.CSSProperties["flexWrap"];
};

/**
 * @deprecated Stack component is deprecated. Use Tailwind flex utilities instead.
 */
export const Stack: React.FC<StackProps> = (props) => {
	const {
		children,
		direction = "column",
		spacing = 2,
		alignItems,
		justifyContent,
		wrap,
		...divProps
	} = props;

	return (
		<div
			{...divProps}
			className={cn("flex max-w-full", divProps.className)}
			style={{
				...divProps.style,
				flexDirection: direction,
				gap: spacing * 8,
				alignItems,
				justifyContent,
				flexWrap: wrap,
			}}
		>
			{children}
		</div>
	);
};
