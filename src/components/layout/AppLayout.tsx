import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppLayout() {
	return (
		<div className="flex min-h-screen">
			<Sidebar />
			<div className="flex flex-col flex-1 min-w-0">
				<TopBar />
				<main className="flex-1 px-4 md:px-6 py-6 max-w-5xl w-full mx-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
