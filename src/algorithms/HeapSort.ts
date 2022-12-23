import { ArrItem } from "./Comparator";
import { Sort } from "./Sort";

export default class HeapSort extends Sort {
	sort(array: ArrItem[]): ArrItem[] {
		const arr = [...array];
		const length = array.length;
		// heapify array
		for (let i = Math.floor(length / 2) - 1; i >= 0; i--) {
			this.heapify(arr, length, i);
		}

		// sort array by extracting every root element
		for (let i = length - 1; i > 0; i--) {
			this.callbacks.swapCallback?.(arr[i].id, arr[0].id);
			const temp = arr[i];
			arr[i] = arr[0];
			arr[0] = temp;

			this.heapify(arr, i, 0);
		}

		return arr;
	}

	heapify(arr: ArrItem[], length: number, largestIndex: number) {
		let largestI = largestIndex;
		const left = 2 * largestI + 1;
		const right = 2 * largestI + 2;

		if (
			left < length &&
			this.comparator.greaterThan(arr[left], arr[largestI])
		) {
			largestI = left;
		}

		if (
			right < length &&
			this.comparator.greaterThan(arr[right], arr[largestI])
		) {
			largestI = right;
		}

		if (largestI !== largestIndex) {
			this.callbacks.swapCallback?.(arr[largestI].id, arr[largestIndex].id);
			const temp = arr[largestI];
			arr[largestI] = arr[largestIndex];
			arr[largestIndex] = temp;

			this.heapify(arr, length, largestI);
		}
	}
}
