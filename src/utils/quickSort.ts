import { ref, watch } from "vue";
import { setRefs, setWorkArea, sortData } from "./shared";

function sleep() {
	return new Promise<void>(res => setTimeout(res, 2250));
}

function swap<T>(arr: T[], i: number, j: number) {
	if (i < 0 || i > arr.length - 1 || j < 0 || j > arr.length - 1)
		throw new Error("Out of array limits!");
	if (!Number.isInteger(i) || !Number.isInteger(j))
		throw new Error("Only integers allowed for array cells!");
	if (i == j) return;
	let tmp = arr[i];
	arr.splice(i, 1, arr[j]);
	arr.splice(j, 1, tmp);
	// arr[i] = arr[j];
	// arr[j] = tmp;
}

async function partition<T>(arr: T[], leftIndex: number, rightIndex: number) {
	console.log(`work from ${leftIndex} till ${rightIndex}`);
	setWorkArea({ start: leftIndex, end: rightIndex });
	//Set pivot to middle element
	let pivotInd = Math.floor((rightIndex + leftIndex) / 2);
	let pivot = arr[pivotInd];
	setRefs({ pivotRef: pivotInd, leftRef: leftIndex, rightRef: rightIndex });
	//Start itterating as long as we didn't set the pivot location.
	while (sortData.refs.leftRef! <= sortData.refs.rightRef!) {
		//Iterrate till we find the pivot's location from left, and reset the left index every time.
		while (arr[sortData.refs.leftRef!] < pivot) sortData.refs.leftRef!++;
		//Iterrate till we find the pivot's location from right, and reset the right index every time.
		while (arr[sortData.refs.rightRef!] > pivot) sortData.refs.rightRef!--;
		//If we need to - change the pivot's location
		if (sortData.refs.leftRef! <= sortData.refs.rightRef!) {
			await sleep();
			swap(arr, sortData.refs.leftRef!, sortData.refs.rightRef!);
			sortData.refs.leftRef!++;
			sortData.refs.rightRef!--;
		}
	}
	return sortData.refs.leftRef!;
}

async function quickSort() {

	await quickSortInner(sortData.arr, 0, sortData.length - 1);
	setWorkArea({ start: undefined, end: undefined });
	setRefs({ pivotRef: undefined, leftRef: undefined, rightRef: undefined });
}

async function quickSortInner(
	arr: number[],
	leftIndex: number,
	rightIndex: number
) {
	//Sort only if array start is smaller than array end (is longer than 1).
	if (arr.length > 1) {
		const pivotIndex = await partition(arr, leftIndex, rightIndex); //index returned from partition
		if (leftIndex < pivotIndex - 1) {
			//move elements on the left side of the pivot
			await quickSortInner(arr, leftIndex, pivotIndex - 1);
		}
		if (pivotIndex < rightIndex) {
			//move elements on the right side of the pivot
			await quickSortInner(arr, pivotIndex, rightIndex);
		}
	}
	return arr;
}

export { quickSort };