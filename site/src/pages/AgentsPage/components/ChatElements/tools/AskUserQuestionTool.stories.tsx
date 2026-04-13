import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Tool } from "./Tool";

const runningPayload = {
	questions: [
		{
			header: "Implementation Approach",
			question: "How should we structure the database migration?",
			options: [
				{
					label: "Single migration",
					description:
						"One migration file with all changes. Simpler but harder to roll back.",
				},
				{
					label: "Incremental migrations",
					description:
						"Split into multiple sequential migrations. More flexible rollback.",
				},
			],
		},
	],
};

const singleQuestionPayload = {
	questions: [
		{
			header: "Implementation Approach",
			question: "How should we structure the database migration?",
			options: [
				{
					label: "Single migration",
					description:
						"One migration file with all changes. Simpler but harder to roll back.",
				},
				{
					label: "Incremental migrations",
					description:
						"Split into multiple sequential migrations. More flexible rollback.",
				},
			],
		},
	],
};

const multipleQuestionsPayload = {
	questions: [
		{
			header: "Implementation Approach",
			question: "How should we structure the database migration?",
			options: [
				{
					label: "Single migration",
					description:
						"One migration file with all changes. Simpler but harder to roll back.",
				},
				{
					label: "Incremental migrations",
					description:
						"Split into multiple sequential migrations. More flexible rollback.",
				},
			],
		},
		{
			header: "Release Plan",
			question: "Which rollout path should we use for the new agent workflow?",
			options: [
				{
					label: "Internal dry run",
					description:
						"Ship to the team first and confirm the migration flow before broader rollout.",
				},
				{
					label: "Small beta",
					description:
						"Start with a limited set of workspaces so we can gather feedback quickly.",
				},
				{
					label: "General rollout",
					description:
						"Release to every workspace after validation is complete.",
				},
			],
		},
	],
};

const manyOptionsPayload = {
	questions: [
		{
			header: "Validation Strategy",
			question:
				"What level of validation should we run before merging the migration changes?",
			options: [
				{
					label: "Typecheck only",
					description:
						"Fastest feedback, but it does not catch regressions outside compilation.",
				},
				{
					label: "Targeted tests",
					description:
						"Run the affected frontend tests and keep validation focused on changed flows.",
				},
				{
					label: "Pre-commit suite",
					description:
						"Use the standard pre-commit checks for broader confidence before review.",
				},
				{
					label: "Pre-push suite",
					description:
						"Run the heaviest local validation before the branch leaves the workstation.",
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
			<div className="max-w-2xl">
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
		args: runningPayload,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		expect(canvas.getByText("Asking for clarification...")).toBeInTheDocument();
		expect(
			canvas.getByTestId("ask-user-question-loading-icon"),
		).toBeInTheDocument();
		expect(canvas.getAllByRole("radio")).toHaveLength(2);
	},
};

export const SingleQuestion: Story = {
	args: {
		status: "completed",
		result: JSON.stringify(singleQuestionPayload),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		expect(canvas.getByText("Implementation Approach")).toBeInTheDocument();
		expect(
			canvas.getByText("How should we structure the database migration?"),
		).toBeInTheDocument();
		expect(canvas.getAllByRole("radio")).toHaveLength(2);
		expect(
			canvas.queryByText("Asking for clarification..."),
		).not.toBeInTheDocument();
	},
};

export const MultipleQuestions: Story = {
	args: {
		status: "completed",
		result: JSON.stringify(multipleQuestionsPayload),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		expect(canvas.getByText("Release Plan")).toBeInTheDocument();
		expect(
			canvas.getByText(
				"Which rollout path should we use for the new agent workflow?",
			),
		).toBeInTheDocument();
		expect(canvas.getAllByRole("radio")).toHaveLength(5);
	},
};

export const ManyOptions: Story = {
	args: {
		status: "completed",
		result: JSON.stringify(manyOptionsPayload),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		expect(canvas.getByText("Validation Strategy")).toBeInTheDocument();
		expect(canvas.getAllByRole("radio")).toHaveLength(4);
		expect(canvas.getByText("Pre-push suite")).toBeInTheDocument();
	},
};

export const ErrorState: Story = {
	args: {
		status: "completed",
		isError: true,
		result: "The planning agent could not deliver follow-up questions.",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		expect(canvas.getByRole("alert")).toBeInTheDocument();
		expect(
			canvas.getByText(
				"The planning agent could not deliver follow-up questions.",
			),
		).toBeInTheDocument();
		expect(canvas.getByLabelText("Error")).toBeInTheDocument();
	},
};
