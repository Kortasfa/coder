import type { FC } from "react";
import type { WorkspaceAgent } from "#/api/typesGenerated";
import { TerminalIcon } from "#/components/Icons/TerminalIcon";
import { VSCodeIcon } from "#/components/Icons/VSCodeIcon";
import { Stack } from "#/components/Stack/Stack";
import { cn } from "#/utils/cn";
import { DisplayAppNameMap } from "./AppLink/AppLink";
import { AppPreview } from "./AppLink/AppPreview";
import { BaseIcon } from "./AppLink/BaseIcon";

interface AgentRowPreviewStyles {
	// Helpful when there are more than one row so the values are aligned
	// When it is only one row, it is better to have than "flex" and not hard aligned
	alignValues?: boolean;
}
interface AgentRowPreviewProps extends AgentRowPreviewStyles {
	agent: WorkspaceAgent;
}

export const AgentRowPreview: FC<AgentRowPreviewProps> = ({
	agent,
	alignValues,
}) => {
	return (
		<Stack
			key={agent.id}
			direction="row"
			alignItems="center"
			justifyContent="space-between"
			className="py-4 px-8 bg-surface-secondary text-[16px] relative [&:not(:last-child)]:pb-0 after:content-[''] after:absolute after:top-0 after:left-[43px] after:h-full after:w-0.5 after:bg-border"
		>
			<Stack direction="row" alignItems="baseline">
				<div className="flex w-6 justify-center shrink-0">
					<div className="w-2.5 h-2.5 border-2 border-solid border-content-secondary rounded-full relative z-[1] bg-surface-secondary" />
				</div>
				<Stack
					alignItems="baseline"
					direction="row"
					spacing={4}
					className="text-[14px] text-content-secondary max-[900px]:gap-4 max-[900px]:flex-wrap"
				>
					<Stack
						direction="row"
						alignItems="baseline"
						spacing={1}
						className={cn(
							"shrink-0 max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-2 max-[900px]:w-fit",
							alignValues && "min-[600px]:min-w-[240px]",
						)}
					>
						<span>Agent:</span>
						<span className="text-content-primary">{agent.name}</span>
					</Stack>

					<Stack
						direction="row"
						alignItems="baseline"
						spacing={1}
						className={cn(
							"shrink-0 max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-2 max-[900px]:w-fit",
							alignValues && "min-[600px]:min-w-[100px]",
						)}
					>
						<span>OS:</span>
						<span className="text-content-primary capitalize text-[14px]">
							{agent.operating_system}
						</span>
					</Stack>

					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
						className="max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-2 max-[900px]:w-fit"
					>
						<span>Apps:</span>
						<Stack
							direction="row"
							alignItems="center"
							spacing={0.5}
							wrap="wrap"
						>
							{/* We display all modules returned in agent.apps */}
							{agent.apps.map((app) => (
								<AppPreview key={app.slug}>
									<BaseIcon app={app} />
									{app.display_name}
								</AppPreview>
							))}
							{/* Additionally, we display any apps that are visible, e.g.
              apps that are included in agent.display_apps */}
							{agent.display_apps.includes("web_terminal") && (
								<AppPreview>
									<TerminalIcon className="size-3" />
									{DisplayAppNameMap.web_terminal}
								</AppPreview>
							)}
							{agent.display_apps.includes("ssh_helper") && (
								<AppPreview>{DisplayAppNameMap.ssh_helper}</AppPreview>
							)}
							{agent.display_apps.includes("port_forwarding_helper") && (
								<AppPreview>
									{DisplayAppNameMap.port_forwarding_helper}
								</AppPreview>
							)}
							{/* VSCode display apps (vscode, vscode_insiders) get special presentation */}
							{agent.display_apps.includes("vscode") ? (
								<AppPreview>
									<VSCodeIcon className="size-3" />
									{DisplayAppNameMap.vscode}
								</AppPreview>
							) : (
								agent.display_apps.includes("vscode_insiders") && (
									<AppPreview>
										<VSCodeIcon className="size-3" />
										{DisplayAppNameMap.vscode_insiders}
									</AppPreview>
								)
							)}
							{agent.apps.length === 0 && agent.display_apps.length === 0 && (
								<span className="text-content-primary">None</span>
							)}
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};
