import { FormEvent, useState, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import Head from "next/head";
import logoImg from "../../../public/logo.svg";
import styles from "../../styles/home.module.scss";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";

export default function SignUp() {
	const { signUp } = useContext(AuthContext);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSignUp(event: FormEvent): Promise<void> {
		event.preventDefault();

		if (!name || !email || !password) {
			toast.warning("Preencha todos os campos necessários!");
			return;
		}

		setLoading(true);

		let data = {
			name,
			email,
			password,
		};

		await signUp(data);

		setLoading(false);
	}

	return (
		<>
			<Head>
				<title>Sujeito Pizza - Faça seu cadastro</title>
			</Head>
			<div className={styles.containerCenter}>
				<Image src={logoImg} alt="Logo Sujeito pizza" />

				<div className={styles.login}>
					<h1>Criando sua conta</h1>
					<form onSubmit={handleSignUp}>
						<Input
							placeholder="Digite seu nome"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<Input
							placeholder="Digite seu e-mail"
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
							Cadastrar
						</Button>
					</form>
				</div>
				<Link className={styles.text} href="/">
					Ja possui uma conta? Faça seu login
				</Link>
			</div>
		</>
	);
}
