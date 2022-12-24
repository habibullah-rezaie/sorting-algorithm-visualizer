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

export abstract class Sort {
	public callbacks: SortCallbacks;
	public comparator: Comparator;
	constructor(originalCallback: SortCallbacks) {
		this.callbacks = originalCallback;
		this.comparator = new Comparator(this.callbacks.compareCallback);
	}

	abstract sort(arr: ArrItem[]): ArrItem[];

	swap(arr: ArrItem[], i: number, j: number) {
		const temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;

		this.callbacks.swapCallback?.(arr[j].id, arr[i].id);
	}
}
