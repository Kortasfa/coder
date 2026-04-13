import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import type React from "react";
import { RadioGroup, RadioGroupItem } from "#/components/RadioGroup/RadioGroup";
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

export const AskUserQuestionTool: React.FC<AskUserQuestionToolProps> = ({
	questions,
	status,
	isError,
	errorMessage,
}) => {
	const isRunning = status === "running";

	if (isError) {
		return (
			<div className="w-full">
				<div
					role="alert"
					className="flex items-center gap-1.5 py-0.5 text-sm text-content-secondary"
				>
					<TriangleAlertIcon
						aria-label="Error"
						className="h-3.5 w-3.5 shrink-0 text-content-secondary"
					/>
					<span>{errorMessage || "Failed to ask questions"}</span>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full">
			{isRunning && (
				<div
					role="status"
					aria-live="polite"
					className="flex items-center gap-1.5 py-0.5"
				>
					<span className="text-sm text-content-secondary">
						Asking for clarification...
					</span>
					<LoaderIcon
						data-testid="ask-user-question-loading-icon"
						className="h-3.5 w-3.5 shrink-0 animate-spin text-content-secondary motion-reduce:animate-none"
					/>
				</div>
			)}

			{questions.length > 0 ? (
				<div className="space-y-5">
					{questions.map((question, questionIndex) => {
						const questionHeaderId = `ask-user-question-header-${questionIndex}`;
						const questionTextId = `ask-user-question-text-${questionIndex}`;

						return (
							<div
								key={`${question.header}-${question.question}-${questionIndex}`}
								className="space-y-3"
							>
								<div className="space-y-1.5">
									<p
										id={questionHeaderId}
										className="text-xs font-medium text-content-secondary"
									>
										{question.header || `Question ${questionIndex + 1}`}
									</p>
									<p
										id={questionTextId}
										className="whitespace-pre-wrap text-sm text-content-primary"
									>
										{question.question || "No question provided."}
									</p>
								</div>

								{question.options.length > 0 ? (
									<RadioGroup
										aria-labelledby={`${questionHeaderId} ${questionTextId}`}
										className="space-y-1"
										name={`ask-user-question-${questionIndex}`}
									>
										{question.options.map((option, optionIndex) => {
											const optionId = `ask-user-question-${questionIndex}-option-${optionIndex}`;

											return (
												<label
													key={`${option.label}-${option.description}-${optionIndex}`}
													htmlFor={optionId}
													className="grid cursor-pointer gap-x-3 gap-y-0.5 py-1.5"
													style={{ gridTemplateColumns: "auto 1fr" }}
												>
													<RadioGroupItem
														className="row-span-2 self-center"
														id={optionId}
														value={`${option.label}-${optionIndex}`}
													/>
													<span className="text-sm font-medium text-content-primary">
														{option.label || `Option ${optionIndex + 1}`}
													</span>
													<p className="m-0 whitespace-pre-wrap text-sm text-content-secondary">
														{option.description || "No description provided."}
													</p>
												</label>
											);
										})}
									</RadioGroup>
								) : (
									<p className="text-sm italic text-content-secondary">
										No options provided.
									</p>
								)}
							</div>
						);
					})}
				</div>
			) : (
				!isRunning && (
					<p className="text-sm italic text-content-secondary">
						No questions available.
					</p>
				)
			)}
		</div>
	);
};
