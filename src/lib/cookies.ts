/** Read a cookie value by name */
export function getCookie(name: string): string | null {
	const match = document.cookie.match(
		new RegExp("(^| )" + name + "=([^;]+)"),
	);
	return match ? decodeURIComponent(match[2]) : null;
}

/** Delete a cookie by setting expiry to the past */
export function deleteCookie(name: string): void {
	document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}
