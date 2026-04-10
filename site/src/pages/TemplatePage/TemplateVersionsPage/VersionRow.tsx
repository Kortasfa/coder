import type { FC } from "react";
import { useNavigate } from "react-router";
import type { TemplateVersion } from "#/api/typesGenerated";
import { Avatar } from "#/components/Avatar/Avatar";
import { Button } from "#/components/Button/Button";
import { InfoTooltip } from "#/components/InfoTooltip/InfoTooltip";
import { Pill } from "#/components/Pill/Pill";
import { Stack } from "#/components/Stack/Stack";
import { TableCell } from "#/components/Table/Table";
import { TimelineEntry } from "#/components/Timeline/TimelineEntry";
import { useClickableTableRow } from "#/hooks/useClickableTableRow";

interface VersionRowProps {
	version: TemplateVersion;
	isActive: boolean;
	isLatest: boolean;
	onPromoteClick?: (templateVersionId: string) => void;
	onArchiveClick?: (templateVersionId: string) => void;
}

export const VersionRow: FC<VersionRowProps> = ({
	version,
	isActive,
	isLatest,
	onPromoteClick,
	onArchiveClick,
}) => {
	const navigate = useNavigate();

	const clickableProps = useClickableTableRow({
		onClick: () => navigate(version.name),
	});

	const jobStatus = version.job.status;

	return (
		<TimelineEntry
			data-testid={`version-${version.id}`}
			{...clickableProps}
			className={clickableProps.className}
		>
			<TableCell className="!p-0 relative border-b-0">
				<Stack
					direction="row"
					alignItems="center"
					className="px-8 py-4"
					justifyContent="space-between"
				>
					<Stack direction="row" alignItems="center">
						<Avatar
							fallback={version.created_by.username}
							src={version.created_by.avatar_url}
						/>
						<Stack
							className="text-base [font-family:inherit]"
							direction="row"
							alignItems="center"
							spacing={1}
						>
							<span>
								<strong>{version.created_by.username}</strong> created the
								version <strong>{version.name}</strong>
							</span>

							{version.message && (
								<InfoTooltip title="Message" message={version.message} />
							)}

							<span className="text-content-secondary text-[12px]">
								{new Date(version.created_at).toLocaleTimeString()}
							</span>
						</Stack>
					</Stack>

					<Stack direction="row" alignItems="center" spacing={2}>
						{isActive && (
							<Pill role="status" type="success">
								Active
							</Pill>
						)}
						{isLatest && (
							<Pill role="status" type="info">
								Newest
							</Pill>
						)}
						{jobStatus === "pending" && (
							<Pill role="status" type="inactive">
								Pending&hellip;
							</Pill>
						)}
						{jobStatus === "running" && (
							<Pill role="status" type="active">
								Building&hellip;
							</Pill>
						)}
						{(jobStatus === "canceling" || jobStatus === "canceled") && (
							<Pill role="status" type="inactive">
								Canceled
							</Pill>
						)}
						{jobStatus === "failed" && (
							<Pill role="status" type="error">
								Failed
							</Pill>
						)}

						{jobStatus === "failed" && onArchiveClick && (
							<Button
								variant="outline"
								disabled={isActive || version.archived}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onArchiveClick?.(version.id);
								}}
							>
								Archive&hellip;
							</Button>
						)}

						{jobStatus === "succeeded" && onPromoteClick && (
							<Button
								variant="outline"
								disabled={isActive || jobStatus !== "succeeded"}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onPromoteClick?.(version.id);
								}}
							>
								Promote&hellip;
							</Button>
						)}
					</Stack>
				</Stack>
			</TableCell>
		</TimelineEntry>
	);
};
