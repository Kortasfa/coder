import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Tool } from "./Tool";

const singleQuestionPayload = {
	questions: [
		{
			header: "Approach",
			question: "Should we use option A or B?",
			options: [
				{
					label: "Option A",
					description: "Faster but less robust.",
				},
				{
					label: "Option B",
					description: "Slower but more thorough.",
				},
			],
		},
	],
};

const multipleQuestionPayload = {
	questions: [
		{
			header: "Approach",
			question: "Should we use option A or B?",
			options: [
				{
					label: "Option A",
					description: "Faster but less robust.",
				},
				{
					label: "Option B",
					description: "Slower but more thorough.",
				},
			],
		},
		{
			header: "Rollout",
			question: "Should we ship this to everyone or start with a small beta?",
			options: [
				{
					label: "Small beta",
					description: "Reduces risk and gives us a quick feedback loop.",
				},
				{
					label: "Full rollout",
					description: "Gets the feature out faster to all users.",
				},
			],
		},
	],
};

const meta: Meta<typeof Tool> = {
	title: "pages/AgentsPage/ChatElements/tools/AskUserQuestion",
	component: Tool,
	decorators: [
		(Story) => (
			<div className="max-w-3xl rounded-lg border border-solid border-border-default bg-surface-primary p-4">
				<Story />
			</div>
		),
	],
	args: { name: "ask_user_question" },
};
export default meta;
type Story = StoryObj<typeof Tool>;

export const Running: Story = {
	args: {
		status: "running",
		args: singleQuestionPayload,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText("Asking 1 question")).toBeInTheDocument();
		expect(canvas.getByText("Approach")).toBeInTheDocument();
		expect(canvas.getByText("Option A")).toBeInTheDocument();
	},
};

export const CompletedSingleQuestion: Story = {
	args: {
		status: "completed",
		args: undefined,
		result: JSON.stringify(singleQuestionPayload),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText("Asked 1 question")).toBeInTheDocument();
		expect(
			canvas.getByText("Should we use option A or B?"),
		).toBeInTheDocument();
		expect(canvas.getByText("Slower but more thorough.")).toBeInTheDocument();
		expect(canvas.queryByText(/"questions"/)).not.toBeInTheDocument();
	},
};

export const CompletedMultipleQuestions: Story = {
	args: {
		status: "completed",
		args: multipleQuestionPayload,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText("Asked 2 questions")).toBeInTheDocument();
		expect(canvas.getByText("Rollout")).toBeInTheDocument();
		expect(
			canvas.getByText(
				"Should we ship this to everyone or start with a small beta?",
			),
		).toBeInTheDocument();
	},
};

export const ErrorState: Story = {
	args: {
		status: "completed",
		isError: true,
		args: singleQuestionPayload,
		result: "Failed to ask questions",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText("Asked 1 question")).toBeInTheDocument();
		expect(canvas.getByLabelText("Error")).toBeInTheDocument();
	},
};
