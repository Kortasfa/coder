export const PLAN_MODE_SEARCH_PARAM = "plan";
export const PLAN_MODE_SEARCH_VALUE = "1";

type BuildAgentChatPathOptions = Readonly<{
	chatId: string;
	planModeEnabled?: boolean;
}>;

type GetPlanModeSearchParamsOptions = Readonly<{
	searchParams?: URLSearchParams;
	planModeEnabled?: boolean;
}>;

export const getPlanModeSearchParams = ({
	searchParams = new URLSearchParams(),
	planModeEnabled = false,
}: GetPlanModeSearchParamsOptions): URLSearchParams => {
	const nextSearchParams = new URLSearchParams(searchParams);
	if (planModeEnabled) {
		nextSearchParams.set(PLAN_MODE_SEARCH_PARAM, PLAN_MODE_SEARCH_VALUE);
	} else {
		nextSearchParams.delete(PLAN_MODE_SEARCH_PARAM);
	}
	return nextSearchParams;
};

export const buildAgentChatPath = ({
	chatId,
	planModeEnabled = false,
}: BuildAgentChatPathOptions): string => {
	const searchParams = getPlanModeSearchParams({ planModeEnabled });
	const search = searchParams.toString();
	return search ? `/agents/${chatId}?${search}` : `/agents/${chatId}`;
};
