import Modal from "react-modal";
import styles from "./styles.module.scss";
import { FiX } from "react-icons/fi";
import { OrderItemProps } from "@/pages/dashboard";

type OrderProps = {
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

interface ModalOrderProps {
	isOpen: boolean;
	onRequestClose: () => void;
	order: OrderItemProps[];
	handleFinishOrder: (id: string) => void;
}

export function ModalOrder({
	isOpen,
	onRequestClose,
	order,
	handleFinishOrder,
}: ModalOrderProps | any) {
	const customStyles = {
		content: {
			top: "50%",
			bottom: "auto",
			left: "50%",
			right: "auto",
			padding: "30px",
			backgroundColor: "#1d1d2e",
			transform: "translate(-50%, -50%)",
		},
	};

	return (
		<Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
			<button
				type="button"
				onClick={onRequestClose}
				className="react-modal-close"
				style={{ background: "transparent", border: 0 }}
			>
				<FiX size={45} color="#f34748" />
			</button>

			<div className={styles.container}>
				<h2>Detalhes do pedido</h2>
				<span className={styles.table}>
					Mesa: <strong>{order[0]?.order.table}</strong>
				</span>
				{order.map((item: OrderProps) => (
					<section className={styles.containerItem} key={item.id}>
						<span>
							{item.amount} - <strong>{item.product.name}</strong>
						</span>
						<span className={styles.description}>
							{item.product.description}
						</span>
					</section>
				))}

				<button
					className={styles.buttonOrder}
					onClick={() => handleFinishOrder(order[0].order_id)}
				>
					Concluir pedido
				</button>
			</div>
		</Modal>
	);
}
