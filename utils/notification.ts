type LoadingType = {
	time?: number;
	message: string;
};

class Notify {
	private spinner(
		color:
			| "primary"
			| "secondary"
			| "success"
			| "warning"
			| "danger"
			| "info"
			| "light"
			| "dark"
	) {
		const newDiv = document.createElement("div");
		newDiv.className = `spinner-border text-${color}`;
		newDiv.role = "status";
		return newDiv;
	}

	private autoHide(timer: number, div: HTMLElement) {
		setTimeout(() => {
			document.body.removeChild(div);
		}, timer);
	}

	private addToDOM(div: HTMLElement) {
		document.body.appendChild(div);
	}

	loading({ message, time }: LoadingType) {
		const container = document.createElement("div");
		container.className = "app-loading-container";

		const newSpan = document.createElement("span");
		newSpan.innerText = message;

		container.append(this.spinner("success"));
		container.append(newSpan);

		this.addToDOM(container);

		if (time) this.autoHide(time, container);

		return container;
	}

	danger({ message, time }: LoadingType) {
		const container = document.createElement("div");
		container.className = "app-loading-container";

		const newSpan = document.createElement("span");
		newSpan.innerText = message;

		container.append(this.spinner("danger"));
		container.append(newSpan);

		this.addToDOM(container);

		if (time) this.autoHide(time, container);

		return container;
	}

	close(div: HTMLElement) {
		if (!div.className.includes("app-loading-container")) return;
		document.body.removeChild(div);
	}
}

export const AppNotification = (() => new Notify())();
