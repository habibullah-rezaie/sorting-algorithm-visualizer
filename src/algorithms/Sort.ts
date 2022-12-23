import Comparator, { ArrItem } from "./Comparator";

export type SortCallbacks = {
	compareCallback?: (
		leftId: string,
		rightId: string,
		status: "equal" | "greater" | "less"
	) => void;
	swapCallback?: (leftId: string, rightId: string) => void;
	moveCallback?: (id: string, blocks: number) => void;
	visitingCallback?: (id: string) => void;
};

export class Sort {
	public callbacks: SortCallbacks;
	public comparator: Comparator;
	constructor(originalCallback: SortCallbacks) {
		this.callbacks = originalCallback;
		this.comparator = new Comparator(this.callbacks.compareCallback);
	}

	sort(arr: ArrItem[]): ArrItem[] {
		throw new Error("this should be implemented.");
	}
}