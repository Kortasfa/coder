import type { FC } from "react";
import { Link as RouterLink } from "react-router";
import { CodeExample } from "#/components/CodeExample/CodeExample";
import { Welcome } from "#/components/Welcome/Welcome";

type CliInstallPageViewProps = {
	origin: string;
};

export const CliInstallPageView: FC<CliInstallPageViewProps> = ({ origin }) => {
	return (
		<div className="flex-1 h-screen flex flex-col justify-center items-center w-[480px] mx-auto">
			<Welcome>Install the Coder CLI</Welcome>

			<p className="text-[16px] text-content-secondary pb-2 text-center leading-[1.4]">
				Copy the command below and{" "}
				<strong className="block">paste it in your terminal.</strong>
			</p>

			<CodeExample
				className="max-w-full"
				code={`curl -fsSL ${origin}/install.sh | sh`}
				secret={false}
			/>

			<div className="pt-4">
				<RouterLink
					to="/workspaces"
					className="block text-center text-content-primary underline underline-offset-[3px] decoration-[hsla(0,0%,100%,0.7)] pt-4 pb-4 hover:no-underline"
				>
					Go to workspaces
				</RouterLink>
			</div>
			<div className="text-[12px] text-content-secondary mt-6">
				&copy; {new Date().getFullYear()} Coder Technologies, Inc.
			</div>
		</div>
	);
};
