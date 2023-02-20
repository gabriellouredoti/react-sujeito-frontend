import { AuthTokenError } from "@/services/errors/AuthTokenError";
import {
	GetServerSideProps,
	GetServerSidePropsContext,
	GetServerSidePropsResult,
} from "next";
import { parseCookies, destroyCookie } from "nookies";

// funcao so para usuarios logados terem acesso
export function canSSRAuth<P>(fn: GetServerSideProps<any>) {
	return async (
		context: GetServerSidePropsContext
	): Promise<GetServerSidePropsResult<P>> => {
		const cookies = parseCookies(context);

		const token = cookies["@nextauth.token"];

		if (!token) {
			return {
				redirect: {
					destination: "/",
					permanent: false,
				},
			};
		}

		try {
			return await fn(context);
		} catch (error) {
			if (error instanceof AuthTokenError) {
				destroyCookie(context, "@nextauth.token");

				return {
					redirect: {
						destination: "/",
						permanent: false,
					},
				};
			}
		}

		return await fn(context);
	};
}
