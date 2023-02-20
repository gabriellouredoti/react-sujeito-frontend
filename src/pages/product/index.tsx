import { useState, FormEvent, ChangeEvent } from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import { Header } from "@/components/Header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import styles from "./styles.module.scss";
import { FiUpload } from "react-icons/fi";

import { setupAPIClient } from "../../services/api";
import { GetServerSidePropsContext } from "next";

type ItemProps = {
	id: string;
	name: string;
};

interface CategoryProps {
	categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps) {
	const [avatarUrl, setAvatarUrl] = useState("");
	const [imageAvatar, setImageAvatar] = useState<any>(null);
	const [categories, setCategories] = useState(categoryList || []);

	const [categorySelected, setCategorySelected] = useState(0);

	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");

	async function handleRegister(e: FormEvent) {
		e.preventDefault();

		const apiClient = setupAPIClient();

		try {
			const data = new FormData();

			if (!name || !price || !description) {
				toast.warning("Preencha os campos necessários.");
				return;
			}

			data.append("name", name);
			data.append("price", price);
			data.append("description", description);
			data.append("category_id", categories[categorySelected].id);
			data.append("file", imageAvatar);

			const response = await apiClient.post("/product", data);

			console.log(response.data);

			toast.success("Produto criado com sucesso!");
		} catch (error) {
			toast.error("Ocorreu um erro");
			console.log("Erro", error);
		}

		// clear form
		setName("");
		setPrice("");
		setDescription("");
		setAvatarUrl("");
		setCategorySelected(0);
		setImageAvatar("");
	}

	function handleFile(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) {
			return;
		}

		const image = e.target.files[0];

		if (!image) {
			return;
		}

		if (image.type === "image/jpeg" || image.type === "image/png") {
			setImageAvatar(image);
			setAvatarUrl(URL.createObjectURL(e.target.files[0]));
		}
	}

	function handleChangeCategory(event: ChangeEvent<any>) {
		setCategorySelected(event.target.value);
	}

	return (
		<>
			<Head>
				<title>Sujeito Pizza - Cardapio</title>
			</Head>
			<div>
				<Header></Header>
				<main className={styles.container}>
					<h1>Novo produto</h1>
					<form className={styles.form} onSubmit={handleRegister}>
						<label className={styles.labelAvatar}>
							<span>
								<FiUpload size={50} color="#fff" />
							</span>

							<input
								type="file"
								accept="image/png, image/jpeg"
								onChange={handleFile}
							/>

							{avatarUrl && (
								<img
									className={styles.preview}
									src={avatarUrl}
									alt="Foto do produto"
									width={250}
									height={250}
								/>
							)}
						</label>

						<select value={categorySelected} onChange={handleChangeCategory}>
							{categories.map((item, index) => (
								<option value={index} key={item.id}>
									{item.name}
								</option>
							))}
						</select>
						<input
							className={styles.input}
							type="text"
							placeholder="Digite o nome do produto"
							onChange={(e) => setName(e.target.value)}
							value={name}
						/>
						<input
							className={styles.input}
							type="text"
							placeholder="Preço do produto"
							onChange={(e) => setPrice(e.target.value)}
							value={price}
						/>
						<textarea
							className={styles.input}
							placeholder="Descreva seu produto"
							onChange={(e) => setDescription(e.target.value)}
							value={description}
						/>
						<button className={styles.buttonAdd} type="submit">
							Cadastrar
						</button>
					</form>
				</main>
			</div>
		</>
	);
}

export const getServerSideProps = canSSRAuth(async (context: any) => {
	const apiClient = setupAPIClient(context);

	const response = await apiClient.get("/category");

	return {
		props: {
			categoryList: response.data,
		},
	};
});
