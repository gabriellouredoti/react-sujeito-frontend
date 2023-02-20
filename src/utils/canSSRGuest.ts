import {
	GetServerSideProps,
	GetServerSidePropsContext,
	GetServerSidePropsResult,
} from "next";
import { parseCookies } from "nookies";

// Funcao para paginas que só pode ser acessadas para visitantes
export function canSSRGuest<P>(fn: GetServerSideProps<any>) {
	return async (
		context: GetServerSidePropsContext
	): Promise<GetServerSidePropsResult<P>> => {
		const cookies = parseCookies(context);

		// Se o usuario tentar acessar a pagina porem tendo login salvo é redirecionado
		if (cookies["@nextauth.token"]) {
			return {
				redirect: {
					destination: "/dashboard",
					permanent: false,
				},
			};
		}

		return await fn(context);
	};
}
