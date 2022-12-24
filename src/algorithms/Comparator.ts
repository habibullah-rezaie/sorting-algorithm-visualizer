export type ComparisonResult = "equal" | "greater" | "less";

export type CompareCallback = (
	aId: string,
	bId: string,
	status: ComparisonResult,
	willSwap: boolean
) => void;

export type ArrItem = {
	val: number;
	id: string;
};

export default class Comparator {
	private callback: CompareCallback | undefined;
	constructor(callback?: CompareCallback) {
		this.callback = callback;
	}

	lessThan(a: ArrItem, b: ArrItem, willSwap = false) {
		if (a.val < b.val) {
			this.callback?.(a.id, b.id, "less", willSwap);
			return true;
		}
	}

	greaterThan(a: ArrItem, b: ArrItem, willSwap = false) {
		if (a.val > b.val) {
			this.callback?.(a.id, b.id, "greater", willSwap);
			return true;
		}
	}

	equal(a: ArrItem, b: ArrItem, willSwap = false) {
		if (a.val === b.val) {
			this.callback?.(a.id, b.id, "equal", willSwap);
			return true;
		}
	}

	greaterThanEqual(a: ArrItem, b: ArrItem, willSwap = false) {
		if (a.val >= b.val) {
			if (a.val === b.val) this.callback?.(a.id, b.id, "equal", willSwap);
			else this.callback?.(a.id, b.id, "greater", willSwap);
			return true;
		}
	}

	lessThanEqual(a: ArrItem, b: ArrItem, willSwap = false) {
		if (a.val <= b.val) {
			if (a.val === b.val) this.callback?.(a.id, b.id, "equal", willSwap);
			else this.callback?.(a.id, b.id, "less", willSwap);
			return true;
		}
	}
}
