import { ArrItem } from "./Comparator";
import { Sort } from "./Sort";

export class MergeSort extends Sort {
	mergeSortedArrays = (leftArr: ArrItem[], rightArr: ArrItem[]) => {
		let leftIndex = 0;
		let rightIndex = 0;
		const sortedArr = [];

		while (leftIndex < leftArr.length && rightIndex < rightArr.length) {
			if (
				this.comparator.lessThanEqual(leftArr[leftIndex], rightArr[rightIndex])
			) {
				sortedArr.push(leftArr[leftIndex]);
				leftIndex++;
			} else {
				this.callbacks.compareCallback?.(
					leftArr[leftIndex].id,
					rightArr[rightIndex].id,
					"greater",
					true
				);
				this.callbacks.moveCallback?.(
					rightArr[rightIndex].id,
					sortedArr.length - (leftArr.length + rightIndex)
				);
				sortedArr.push(rightArr[rightIndex]);
				rightIndex++;
			}
		}

		const leftSlice = leftArr.slice(leftIndex);
		const rightSlice = rightArr.slice(rightIndex);

		const finalArr = [...sortedArr, ...leftSlice, ...rightSlice];

		return finalArr;
	};

	sort(arr: ArrItem[]): ArrItem[] {
		if (arr.length <= 1) {
			return arr;
		}

		const middle = Math.floor(arr.length / 2);

		return this.mergeSortedArrays(
			this.sort(arr.slice(0, middle)),
			this.sort(arr.slice(middle))
		);
	}
}
