import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import type { Organization } from "#/api/typesGenerated";
import { CompactOrgSelector } from "./CompactOrgSelector";

const mockOrgs: Organization[] = [
	{
		id: "org-1",
		name: "acme-corp",
		display_name: "Acme Corp",
		description: "Main organization",
		icon: "",
		created_at: "2024-01-01T00:00:00Z",
		updated_at: "2024-01-01T00:00:00Z",
		is_default: true,
	},
	{
		id: "org-2",
		name: "beta-labs",
		display_name: "Beta Labs",
		description: "Research organization",
		icon: "",
		created_at: "2024-01-01T00:00:00Z",
		updated_at: "2024-01-01T00:00:00Z",
		is_default: false,
	},
	{
		id: "org-3",
		name: "gamma-inc",
		display_name: "Gamma Inc",
		description: "Third organization",
		icon: "",
		created_at: "2024-01-01T00:00:00Z",
		updated_at: "2024-01-01T00:00:00Z",
		is_default: false,
	},
];

const meta: Meta<typeof CompactOrgSelector> = {
	title: "pages/AgentsPage/ChatElements/CompactOrgSelector",
	component: CompactOrgSelector,
	decorators: [
		(Story) => (
			<div className="w-72 rounded-lg border border-solid border-border-default bg-surface-primary p-4">
				<Story />
			</div>
		),
	],
	args: {
		options: mockOrgs,
		value: null,
		onChange: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof CompactOrgSelector>;

export const Default: Story = {};

export const WithSelectedValue: Story = {
	args: {
		value: mockOrgs[0],
	},
};

export const Disabled: Story = {
	args: {
		value: mockOrgs[0],
		disabled: true,
	},
};

export const NoOptions: Story = {
	args: {
		options: [],
		value: null,
	},
};

export const SelectsOrganization: Story = {
	args: {
		options: mockOrgs,
		value: null,
		onChange: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		// Open the popover by clicking the trigger.
		const trigger = canvas.getByTestId("compact-org-selector");
		await userEvent.click(trigger);

		// The dropdown should appear with org options.
		const option = await within(document.body).findByText("Beta Labs");
		await userEvent.click(option);

		expect(args.onChange).toHaveBeenCalledWith(mockOrgs[1]);
	},
};
