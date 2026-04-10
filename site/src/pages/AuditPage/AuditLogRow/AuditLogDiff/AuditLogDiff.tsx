import type { FC } from "react";
import type { AuditDiff } from "#/api/typesGenerated";

const getDiffValue = (value: unknown): string => {
	if (typeof value === "string") {
		return `"${value}"`;
	}

	if (isTimeObject(value)) {
		if (!value.Valid) {
			return "null";
		}

		return new Date(value.Time).toLocaleString();
	}

	if (Array.isArray(value)) {
		const values = value.map((v) => getDiffValue(v));
		return `[${values.join(", ")}]`;
	}

	if (value === null || value === undefined) {
		return "null";
	}

	return String(value);
};

const isTimeObject = (
	value: unknown,
): value is { Time: string; Valid: boolean } => {
	return (
		value !== null &&
		typeof value === "object" &&
		"Time" in value &&
		typeof value.Time === "string" &&
		"Valid" in value &&
		typeof value.Valid === "boolean"
	);
};

interface AuditLogDiffProps {
	diff: AuditDiff;
}

export const AuditLogDiff: FC<AuditLogDiffProps> = ({ diff }) => {
	const diffEntries = Object.entries(diff);

	return (
		<div className="flex items-start text-sm border-t border-border font-mono relative z-[2]">
			<div className="flex-1 pt-4 pb-5 pr-4 leading-[160%] self-stretch [overflow-wrap:anywhere] bg-red-950 text-red-50">
				{diffEntries.map(([attrName, valueDiff], index) => (
					<div key={attrName} className="flex items-baseline">
						<div className="opacity-50 w-12 text-right shrink-0">
							{index + 1}
						</div>
						<div className="w-8 text-center text-base shrink-0">-</div>
						<div>
							{attrName}:{" "}
							<span className="p-px rounded bg-red-800">
								{valueDiff.secret ? "••••••••" : getDiffValue(valueDiff.old)}
							</span>
						</div>
					</div>
				))}
			</div>
			<div className="flex-1 pt-4 pb-5 pr-4 leading-[160%] self-stretch [overflow-wrap:anywhere] bg-green-950 text-green-50">
				{diffEntries.map(([attrName, valueDiff], index) => (
					<div key={attrName} className="flex items-baseline">
						<div className="opacity-50 w-12 text-right shrink-0">
							{index + 1}
						</div>
						<div className="w-8 text-center text-base shrink-0">+</div>
						<div>
							{attrName}:{" "}
							<span className="p-px rounded bg-green-800">
								{valueDiff.secret ? "••••••••" : getDiffValue(valueDiff.new)}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
