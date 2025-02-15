import { FormEvent, useContext, useState } from "react";
import Head from "next/head";
import logoImg from "../../public/logo.svg";
import styles from "../styles/home.module.scss";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { canSSRGuest } from "@/utils/canSSRGuest";

export default function Home() {
	const { signIn } = useContext(AuthContext);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleLogin(event: FormEvent) {
		event.preventDefault();

		if (!email && !password) {
			toast.warning("Preencha todos os campos necessários!");
			return;
		}

		setLoading(true);

		let data = {
			email,
			password,
		};

		await signIn(data);

		setLoading(false);
	}

	return (
		<>
			<Head>
				<title>Sujeito Pizza - Faça seu login</title>
			</Head>
			<div className={styles.containerCenter}>
				<Image src={logoImg} alt="Logo Sujeito pizza" />

				<div className={styles.login}>
					<form onSubmit={handleLogin}>
						<Input
							placeholder="Digite seu email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							type="password"
							placeholder="Digite sua senha"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" loading={loading}>
							Acessar
						</Button>
					</form>
				</div>
				<Link className={styles.text} href="/signup">
					Não possui uma conta? Cadastre-se
				</Link>
			</div>
		</>
	);
}

export const getServerSideProps = canSSRGuest(async (context) => {
	return {
		props: {},
	};
});
