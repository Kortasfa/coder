import { describe, expect, it } from "vitest";
import {
	buildAgentChatPath,
	getPlanModeSearchParams,
	PLAN_MODE_SEARCH_PARAM,
	PLAN_MODE_SEARCH_VALUE,
} from "./planMode";

describe("planMode", () => {
	describe(buildAgentChatPath.name, () => {
		it("appends the plan query when plan mode is enabled", () => {
			expect(
				buildAgentChatPath({ chatId: "chat-1", planModeEnabled: true }),
			).toBe(
				`/agents/chat-1?${PLAN_MODE_SEARCH_PARAM}=${PLAN_MODE_SEARCH_VALUE}`,
			);
		});

		it("returns a clean chat path when plan mode is disabled", () => {
			expect(buildAgentChatPath({ chatId: "chat-1" })).toBe("/agents/chat-1");
		});
	});

	describe(getPlanModeSearchParams.name, () => {
		it("deletes the plan query key when plan mode is cleared", () => {
			const nextSearchParams = getPlanModeSearchParams({
				searchParams: new URLSearchParams({
					[PLAN_MODE_SEARCH_PARAM]: PLAN_MODE_SEARCH_VALUE,
				}),
				planModeEnabled: false,
			});

			expect(nextSearchParams.get(PLAN_MODE_SEARCH_PARAM)).toBeNull();
			expect(nextSearchParams.toString()).toBe("");
		});
	});
});
