import Link from "next/link";
import React from "react";

export type ButtonProps = {
	className?: string;
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	type?: "button" | "submit" | "reset" | undefined;
	children?: string | React.ReactNode;
	disabled?: boolean;
	style?: React.CSSProperties;
	id?: string;
	link?: string
	render?: () => React.ReactElement
};

const Button = ({
	className,
	onClick,
	type = "button",
	children,
	disabled = false,
	style,
	id,
	link,
	render,
	...props
}: ButtonProps) => {

	if (link) {
		return <Link href={link}>
			<button
				className={`appButton ${className}`}
				type={type}
				onClick={onClick}
				disabled={disabled}
				style={style}
				id={id} {...props}>
				{children ??( render ? render() : null)}
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
			id={id} {...props}>
			{children ??( render ? render() : null)}

		</button>
	);
};

export default Button;
