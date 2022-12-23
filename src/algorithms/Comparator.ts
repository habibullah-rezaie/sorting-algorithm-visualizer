export type ComparisonResult = "equal" | "greater" | "less";

export type CompareCallback = (
	aId: string,
	bId: string,
	status: ComparisonResult
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

	lessThan(a: ArrItem, b: ArrItem) {
		if (a.val < b.val) {
			this.callback?.(a.id, b.id, "less");
			return true;
		}
	}

	greaterThan(a: ArrItem, b: ArrItem) {
		if (a.val > b.val) {
			this.callback?.(a.id, b.id, "greater");
			return true;
		}
	}

	equal(a: ArrItem, b: ArrItem) {
		if (a.val === b.val) {
			this.callback?.(a.id, b.id, "equal");
			return true;
		}
	}

	greaterThanEqual(a: ArrItem, b: ArrItem) {
		if (a.val >= b.val) {
			if (a.val === b.val) this.callback?.(a.id, b.id, "equal");
			else this.callback?.(a.id, b.id, "greater");
			return true;
		}
	}

	lessThanEqual(a: ArrItem, b: ArrItem) {
		if (a.val <= b.val) {
			if (a.val === b.val) this.callback?.(a.id, b.id, "equal");
			else this.callback?.(a.id, b.id, "less");
			return true;
		}
	}
}
