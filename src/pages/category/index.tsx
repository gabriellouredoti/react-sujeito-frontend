import styles from "./styles.module.scss";
import { useState, FormEvent } from "react";
import Head from "next/head";
import { Header } from "@/components/Header";
import { toast } from "react-toastify";
import { setupAPIClient } from "@/services/api";

import { canSSRAuth } from "@/utils/canSSRAuth";

export default function Category() {
	const [name, setName] = useState("");

	async function handleCategory(e: FormEvent) {
		e.preventDefault();

		if (!name) {
			toast.warning("Digite o nome da categoria");
			return;
		}

		const apiClient = setupAPIClient();

		try {
			const response = await apiClient.post("/category", {
				name,
			});

			toast.success("Categoria criada com succeso");
			setName("");
		} catch (error) {
			toast.error("Erro ao criar categoria");
			console.log("Erro", error);
		}
	}

	return (
		<>
			<Head>
				<title>Sujeito Pizza - Nova Categoria</title>
			</Head>
			<Header />

			<main className={styles.container}>
				<h1>Cadastrar categorias</h1>

				<form className={styles.form} onSubmit={handleCategory}>
					<input
						type="text"
						placeholder="Digite o nome da categoria"
						className={styles.input}
						onChange={(e) => setName(e.target.value)}
						value={name}
					/>

					<button className={styles.buttonAdd} type="submit">
						Cadastrar
					</button>
				</form>
			</main>
		</>
	);
}

export const getServerSideProps = canSSRAuth(async (context) => {
	return {
		props: {},
	};
});
