import React from "react";

type Props = {
	className?: string;
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	type?: "button" | "submit" | "reset" | undefined;
	children?: string | React.ReactNode;
	disabled?: boolean;
	style?: React.CSSProperties;
	id?: string;
};

const Button = ({
	className,
	onClick,
	type = "button",
	children,
	disabled = false,
	style,
	id,
}: Props) => {
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
