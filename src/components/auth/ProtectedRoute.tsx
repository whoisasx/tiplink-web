import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { status } = useAuthStore();
	const location = useLocation();

	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	if (status === "unauthenticated") {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
