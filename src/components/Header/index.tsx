import { AuthContext } from "@/contexts/AuthContext";
import styles from "./styles.module.scss";
import Link from "next/link";

import { FiLogOut } from "react-icons/fi";
import { useContext } from "react";

export function Header() {
	const { signOut } = useContext(AuthContext);

	return (
		<header className={styles.headerContainer}>
			<div className={styles.headerContent}>
				<Link href="/dashboard">
					<img src="/logo.svg" width={190} height={60} />
				</Link>

				<nav>
					<Link href="/category">Categoria</Link>
					<Link href="/product">Cardápio</Link>
					<button onClick={signOut}>
						<FiLogOut color="#FFF" size={24} />
					</button>
				</nav>
			</div>
		</header>
	);
}
