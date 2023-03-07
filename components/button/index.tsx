import Link from "next/link";
import React from "react";

type Props = {
	className?: string;
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	type?: "button" | "submit" | "reset" | undefined;
	children?: string | React.ReactNode;
	disabled?: boolean;
	style?: React.CSSProperties;
	id?: string;
	link?: string
};

const Button = ({
	className,
	onClick,
	type = "button",
	children,
	disabled = false,
	style,
	id,
	link
}: Props) => {

	if (link) {
		return <Link href={link}>
			<button
				className={`appButton ${className}`}
				type={type}
				onClick={onClick}
				disabled={disabled}
				style={style}
				id={id}>
				{children}
			</button>
		</Link>
	}

	return (
		<button
			className={`appButton ${className}`}
			type={type}
			onClick={onClick}
			disabled={disabled}
			style={style}
			id={id}>
			{children}
		</button>
	);
};

export default Button;
