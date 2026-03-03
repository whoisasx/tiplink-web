import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginPage } from "@/pages/LoginPage";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { WalletPage } from "@/pages/WalletPage";
import { LinksPage } from "@/pages/LinksPage";
import { LinkDetailPage } from "@/pages/LinkDetailPage";
import { CreateLinkPage } from "@/pages/CreateLinkPage";
import { SwapPage } from "@/pages/SwapPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ClaimPage } from "@/pages/ClaimPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

const router = createBrowserRouter([
	// Public routes
	{
		path: "/",
		element: <LandingPage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/claim/:token",
		element: <ClaimPage />,
	},

	// Authenticated routes
	{
		element: (
			<ProtectedRoute>
				<AppLayout />
			</ProtectedRoute>
		),
		children: [
			{
				path: "/dashboard",
				element: <DashboardPage />,
			},
			{
				path: "/wallet",
				element: <WalletPage />,
			},
			{
				path: "/links",
				element: <LinksPage />,
			},
			{
				path: "/links/create",
				element: <CreateLinkPage />,
			},
			{
				path: "/links/:token",
				element: <LinkDetailPage />,
			},
			{
				path: "/swap",
				element: <SwapPage />,
			},
			{
				path: "/profile",
				element: <ProfilePage />,
			},
			{
				path: "/app",
				element: <Navigate to="/dashboard" replace />,
			},
		],
	},

	// 404
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
//   const getCookie = (name: string) => {
//     const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//     return match ? decodeURIComponent(match[2]) : null;
//   };

//   const deleteCookie = (name: string) => {
//     document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
//   };

//   const status = getCookie('auth_status');
//   const message = getCookie('auth_message');

//   if (status) {
//     if (status === 'error') {
//       console.error("Login Error:", message);
//       // show your notification/toast here
//     } else if (status === 'success') {
//       console.log("Login Success!");
//     }

//     // Clean up immediately so the message doesn't re-appear on refresh
//     deleteCookie('auth_status');
//     deleteCookie('auth_message');
//   }
// }, []);
