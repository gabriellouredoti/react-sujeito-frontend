import { useState } from "react";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import { Header } from "@/components/Header";
import styles from "./styles.module.scss";
import { FiRefreshCcw } from "react-icons/fi";
import { setupAPIClient } from "@/services/api";
import Modal from "react-modal";
import { ModalOrder } from "@/components/ModalOrder";
import { toast } from "react-toastify";

type OrderItem = {
	id: string;
	table: string | number;
	status: boolean;
	draft: boolean;
	name: string | null;
};

interface HomeProps {
	orders: OrderItem[];
}

export type OrderItemProps = {
	id: string;
	amount: number;
	order_id: string;
	product_id: string;
	product: {
		id: string;
		name: string;
		description: string;
		price: string;
		banner: string;
	};
	order: {
		id: string;
		table: string | number;
		status: boolean;
		draft: boolean;
		name: string | null;
	};
};

export default function Dashboard({ orders }: HomeProps) {
	const [orderList, setOrderList] = useState(orders || []);

	const [modalVisible, setModalVisible] = useState(false);
	const [modalItem, setModalItem] = useState<OrderItemProps[]>();

	function handleCloseModal() {
		setModalVisible(false);
	}

	async function handleOpenModalView(id: string) {
		const apiClient = setupAPIClient();

		const response = await apiClient.get("/order/detail", {
			params: { order_id: id },
		});

		setModalItem(response.data);
		setModalVisible(true);
	}

	async function handleFinishItem(id: string) {
		const apiClient = setupAPIClient();

		try {
			await apiClient.put("/order/finish", {
				order_id: id,
			});

			await handleRefreshOrders();

			toast("Pedido finalizado com sucesso!");
			setModalVisible(false);
		} catch (error) {
			toast.error("Ocorreu um erro.");
			console.log("Error ", error);
		}
	}

	async function handleRefreshOrders() {
		const apiClient = setupAPIClient();

		const response = await apiClient.get("/orders");

		setOrderList(response.data);
		toast.success("Lista de pedidos atualizada!");
	}

	Modal.setAppElement("#__next");

	return (
		<>
			<Head>
				<title>Painel - Sujeito Pizzaria</title>
			</Head>

			<div>
				<Header />
				<main className={styles.container}>
					<div className={styles.containerHeader}>
						<h1>Últimos Pedidos</h1>
						<button onClick={handleRefreshOrders}>
							<FiRefreshCcw color="#3fffa3" size={25} />
						</button>
					</div>
					<article className={styles.listOrders}>
						{orderList &&
							orderList.map((item) => (
								<section className={styles.orderItem} key={item.id}>
									<button onClick={() => handleOpenModalView(item.id)}>
										<div className={styles.tag}></div>
										<span>Mesa {item.table}</span>
									</button>
								</section>
							))}
					</article>
				</main>

				{modalVisible && (
					<ModalOrder
						isOpen={modalVisible}
						onRequestClose={handleCloseModal}
						order={modalItem}
						handleFinishOrder={handleFinishItem}
					></ModalOrder>
				)}
			</div>
		</>
	);
}

export const getServerSideProps = canSSRAuth(async (context: any) => {
	const apiClient = setupAPIClient(context);

	const response = await apiClient.get("/orders");

	return {
		props: {
			orders: response.data,
		},
	};
});
