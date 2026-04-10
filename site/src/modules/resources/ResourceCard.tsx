import { Children, type FC, type JSX, useState } from "react";
import type { WorkspaceAgent, WorkspaceResource } from "#/api/typesGenerated";
import { ChevronDownIcon } from "#/components/AnimatedIcons/ChevronDown";
import { Button } from "#/components/Button/Button";
import { CopyableValue } from "#/components/CopyableValue/CopyableValue";
import { MemoizedInlineMarkdown } from "#/components/Markdown/InlineMarkdown";
import { Stack } from "#/components/Stack/Stack";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "#/components/Tooltip/Tooltip";
import { ResourceAvatar } from "./ResourceAvatar";
import { SensitiveValue } from "./SensitiveValue";

interface ResourceCardProps {
	resource: WorkspaceResource;
	agentRow: (agent: WorkspaceAgent) => JSX.Element;
}

export const ResourceCard: FC<ResourceCardProps> = ({ resource, agentRow }) => {
	const [shouldDisplayAllMetadata, setShouldDisplayAllMetadata] =
		useState(false);
	const metadataToDisplay = resource.metadata ?? [];

	const visibleMetadata = shouldDisplayAllMetadata
		? metadataToDisplay
		: metadataToDisplay.slice(0, resource.daily_cost > 0 ? 3 : 4);

	const mLength =
		resource.daily_cost > 0
			? (resource.metadata?.length ?? 0) + 1
			: (resource.metadata?.length ?? 0);

	const gridWidth = mLength === 1 ? 1 : 4;

	return (
		<div
			key={resource.id}
			className="resource-card border border-solid border-border bg-surface-primary [&:not(:last-child)]:border-b-0 first-of-type:rounded-t-[8px] last:rounded-b-[8px]"
		>
			<Stack
				direction="row"
				alignItems="flex-start"
				className="py-6 px-8 border-0 border-b border-solid border-border last:border-b-0 max-[900px]:w-full max-[900px]:overflow-scroll"
				spacing={10}
			>
				<Stack
					direction="row"
					spacing={1}
					className="shrink-0 w-fit min-w-[220px]"
				>
					<div>
						<ResourceAvatar resource={resource} />
					</div>
					<div className="text-[14px] leading-normal">
						<div className="text-[12px] text-content-secondary truncate">
							{resource.type}
						</div>
						<div className="truncate">{resource.name}</div>
					</div>
				</Stack>

				<div
					className="grow-[2] grid gap-x-10 gap-y-6"
					style={{
						gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
					}}
				>
					{resource.daily_cost > 0 && (
						<div className="text-[14px] leading-normal">
							<div className="text-[12px] text-content-secondary truncate">
								<b>Daily cost</b>
							</div>
							<div className="truncate">{resource.daily_cost}</div>
						</div>
					)}
					{visibleMetadata.map((meta) => {
						return (
							<div className="text-[14px] leading-normal" key={meta.key}>
								<div className="text-[12px] text-content-secondary truncate">
									{meta.key}
								</div>
								<div className="truncate">
									{meta.sensitive ? (
										<SensitiveValue value={meta.value} />
									) : (
										<MemoizedInlineMarkdown
											components={{
												p: ({ children }) => {
													const childrens = Children.toArray(children);
													if (
														childrens.every(
															(child) => typeof child === "string",
														)
													) {
														return (
															<CopyableValue value={childrens.join("")}>
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
							</div>
						);
					})}
				</div>
				{mLength > 4 && (
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								onClick={() => {
									setShouldDisplayAllMetadata((value) => !value);
								}}
								size="icon-lg"
								variant="subtle"
							>
								<ChevronDownIcon open={shouldDisplayAllMetadata} />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							{shouldDisplayAllMetadata ? "Hide metadata" : "Show all metadata"}
						</TooltipContent>
					</Tooltip>
				)}
			</Stack>

			{resource.agents && resource.agents.length > 0 && (
				<div>{resource.agents.map(agentRow)}</div>
			)}
		</div>
	);
};
