import { ArrItem } from "./Comparator";
import { Sort } from "./Sort";

export default class SelectionSort extends Sort {
	sort(arr: ArrItem[]): ArrItem[] {
		const newArr = [...arr];

		for (let i = 0; i < newArr.length; i++) {
			let minIndex = i;
			for (let j = i + 1; j < newArr.length; j++) {
				if (this.comparator.lessThan(newArr[j], newArr[minIndex])) {
					minIndex = j;
				}
			}

			if (minIndex !== i) this.swap(newArr, minIndex, i);
		}

		return newArr;
	}
}
