import type { FC } from "react";
import { MemoizedMarkdown } from "#/components/Markdown/Markdown";

interface TemplateUpdateMessageProps {
	children: string;
}

export const TemplateUpdateMessage: FC<TemplateUpdateMessageProps> = ({
	children,
}) => {
	return (
		<MemoizedMarkdown
			className={[
				"text-[14px] leading-[1.2]",
				"[&_:is(h1,h2,h3,h4,h5,h6)]:m-0 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-[0.75em]",
				"[&_h1]:text-[1.2em] [&_h2]:text-[1.15em] [&_h3]:text-[1.1em]",
				"[&_h4]:text-[1.05em] [&_h5]:text-[1em] [&_h6]:text-[0.95em]",
			].join(" ")}
		>
			{children}
		</MemoizedMarkdown>
	);
};
