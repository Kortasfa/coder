import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import type React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "#/components/Tooltip/Tooltip";
import { cn } from "#/utils/cn";
import { ToolCollapsible } from "./ToolCollapsible";
import type { ToolStatus } from "./utils";

export type AskUserQuestion = {
	header: string;
	question: string;
	options: Array<{ label: string; description: string }>;
};

type AskUserQuestionToolProps = {
	questions: AskUserQuestion[];
	status: ToolStatus;
	isError: boolean;
	errorMessage?: string;
};

const formatQuestionCount = (count: number): string => {
	if (count <= 0) {
		return "questions";
	}

	return `${count} question${count === 1 ? "" : "s"}`;
};

export const AskUserQuestionTool: React.FC<AskUserQuestionToolProps> = ({
	questions,
	status,
	isError,
	errorMessage,
}) => {
	const isRunning = status === "running";
	const headerLabel = isRunning
		? `Asking ${formatQuestionCount(questions.length)}`
		: `Asked ${formatQuestionCount(questions.length)}`;
	const emptyStateLabel = isRunning
		? "Questions will appear here once available."
		: "No questions available.";

	return (
		<ToolCollapsible
			className="w-full"
			defaultExpanded
			header={
				<>
					<span className={cn("text-sm", "text-content-secondary")}>
						{headerLabel}
					</span>
					{isError && (
						<Tooltip>
							<TooltipTrigger asChild>
								<TriangleAlertIcon
									aria-label="Error"
									className="h-3.5 w-3.5 shrink-0 text-content-secondary"
								/>
							</TooltipTrigger>
							<TooltipContent>
								{errorMessage || "Failed to ask questions"}
							</TooltipContent>
						</Tooltip>
					)}
					{isRunning && (
						<LoaderIcon className="h-3.5 w-3.5 shrink-0 animate-spin motion-reduce:animate-none text-content-secondary" />
					)}
				</>
			}
		>
			<div className="mt-2 space-y-3">
				{questions.length > 0 ? (
					<ol className="space-y-3">
						{questions.map((question, questionIndex) => (
							<li
								key={`${question.header}-${question.question}-${questionIndex}`}
								className="rounded-lg border border-solid border-border-default bg-surface-secondary p-3"
							>
								<div className="space-y-3">
									<div className="space-y-1.5">
										<p className="text-xs font-semibold text-content-secondary">
											{question.header || `Question ${questionIndex + 1}`}
										</p>
										<p className="whitespace-pre-wrap text-sm text-content-primary">
											{question.question || "No question provided."}
										</p>
									</div>
									{question.options.length > 0 ? (
										<ul className="space-y-2">
											{question.options.map((option, optionIndex) => (
												<li
													key={`${option.label}-${option.description}-${optionIndex}`}
													className="rounded-md border border-solid border-border-default bg-surface-primary px-3 py-2"
												>
													<p className="text-sm font-medium text-content-primary">
														{option.label || `Option ${optionIndex + 1}`}
													</p>
													<p className="mt-1 whitespace-pre-wrap text-sm text-content-secondary">
														{option.description || "No description provided."}
													</p>
												</li>
											))}
										</ul>
									) : (
										<p className="text-sm italic text-content-secondary">
											No options provided.
										</p>
									)}
								</div>
							</li>
						))}
					</ol>
				) : (
					<p className="text-sm italic text-content-secondary">
						{emptyStateLabel}
					</p>
				)}
			</div>
		</ToolCollapsible>
	);
};
