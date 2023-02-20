import { AuthProvider } from "@/contexts/AuthContext";
import "@/styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<Component {...pageProps} />;
			<ToastContainer autoClose={3000}></ToastContainer>
		</AuthProvider>
	);
}
