import { Children, type FC, type HTMLAttributes } from "react";
import type { WorkspaceResource } from "#/api/typesGenerated";
import { CopyableValue } from "#/components/CopyableValue/CopyableValue";
import { MemoizedInlineMarkdown } from "#/components/Markdown/InlineMarkdown";
import { SensitiveValue } from "#/modules/resources/SensitiveValue";

type ResourceMetadataProps = Omit<HTMLAttributes<HTMLElement>, "resource"> & {
	resource: WorkspaceResource;
};

export const ResourceMetadata: FC<ResourceMetadataProps> = ({
	resource,
	...headerProps
}) => {
	const metadata = resource.metadata ? [...resource.metadata] : [];

	if (resource.daily_cost > 0) {
		metadata.push({
			key: "Daily cost",
			value: resource.daily_cost.toString(),
			sensitive: false,
		});
	}

	if (metadata.length === 0) {
		return null;
	}

	return (
		<header
			className="p-6 flex flex-wrap gap-12 gap-y-6 mb-6 text-sm"
			{...headerProps}
		>
			{metadata.map((meta) => {
				return (
					<div className="leading-normal" key={meta.key}>
						<div className="truncate">
							{meta.sensitive ? (
								<SensitiveValue value={meta.value} />
							) : (
								<MemoizedInlineMarkdown
									components={{
										p: ({ children }) => {
											const childrenArray = Children.toArray(children);
											if (
												childrenArray.every(
													(child) => typeof child === "string",
												)
											) {
												return (
													<CopyableValue value={childrenArray.join("")}>
														{children}
													</CopyableValue>
												);
											}
											return <>{children}</>;
										},
									}}
								>
									{meta.value}
								</MemoizedInlineMarkdown>
							)}
						</div>
						<div className="text-[13px] text-content-secondary truncate">
							{meta.key}
						</div>
					</div>
				);
			})}
		</header>
	);
};
