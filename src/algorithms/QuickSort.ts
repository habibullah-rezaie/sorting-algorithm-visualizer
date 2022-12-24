import { ArrItem } from "./Comparator";
import { Sort } from "./Sort";

export default class QuickSort extends Sort {
	sort(arr: ArrItem[]): ArrItem[] {
		const newArr = [...arr];
		this.quickSort(newArr, 0, newArr.length - 1);
		return newArr;
	}

	quickSort(arr: ArrItem[], low: number, high: number) {
		if (low < high) {
			const pvtIndex = this.partition(arr, low, high);

			this.quickSort(arr, low, pvtIndex - 1);
			this.quickSort(arr, pvtIndex + 1, high);
		}
	}

	partition(arr: ArrItem[], low: number, high: number): number {
		let smIndex = low - 1;
		for (let i = low; i <= high - 1; i++) {
			if (this.comparator.greaterThan(arr[high], arr[i], true)) {
				smIndex++;

				if (smIndex !== i) this.swap(arr, i, smIndex);
			}
		}

		smIndex++;
		this.swap(arr, smIndex, high);

		return smIndex;
	}
}
