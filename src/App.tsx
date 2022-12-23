import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Slider,
} from "@mui/material";
import React from "react";
import HeapSort from "./algorithms/HeapSort";
import { MergeSort } from "./algorithms/MergeSort";
import { Sort } from "./algorithms/Sort";
import "./App.css";
import Bars from "./components/Bars";

// TODO: change speed based on size as well
// TODO: change width of bar based on size
// TODO: set a fixed width for bar section

export type SorterEvent =
	| { type: "compare"; aId: string; bId: string }
	| { type: "swap"; aId: string; bId: string }
	| { type: "visit"; id: string }
	| { type: "move"; id: string; blocks: number };
function App() {
	const [barsCount, setBarsCount] = React.useState(10);
	const [speed, setSpeed] = React.useState(0);
	const [events, setEvents] = React.useState<SorterEvent[]>([]);
	const [isVisualizing, setIsVisualizing] = React.useState(false);
	const [randomArr, setRandomArr] = React.useState(() =>
		getRandNumArr(barsCount)
	);

	const heapSorter = new HeapSort({});
	console.log(heapSorter.sort([...randomArr]));

	const barsCountRef = React.useRef(barsCount);
	React.useEffect(() => {
		if (!isVisualizing && barsCountRef.current !== barsCount) {
			barsCountRef.current = barsCount;
			setRandomArr(getRandNumArr(barsCount));
		}
	}, [barsCount, isVisualizing]);

	React.useEffect(() => {
		const id = setTimeout(() => {
			if (events.length > 0) {
				const newEvents = [...events];
				newEvents.shift();
				setEvents(newEvents);
			} else {
				setIsVisualizing(false);
			}
		}, speed);

		return () => clearTimeout(id);
	}, [events, speed]);

	React.useEffect(() => {
		const currentEvent = events["0"];
		if (currentEvent && currentEvent.type === "move") {
			setRandomArr((randomArr) => {
				const newArr = [...randomArr];
				const itemIndex = newArr.findIndex(
					(item) => item.id === currentEvent.id
				);
				const newIndex = itemIndex + currentEvent.blocks;

				if (itemIndex !== -1) {
					const item = newArr[itemIndex];
					newArr.splice(itemIndex, 1);
					newArr.splice(newIndex, 0, item);
				}
				return newArr;
			});
		} else if (currentEvent && currentEvent.type === "swap") {
			setRandomArr((randomArr) => {
				const newArr = [...randomArr];

				const aIndex = newArr.findIndex((item) => item.id === currentEvent.aId);
				const bIndex = newArr.findIndex((item) => item.id === currentEvent.bId);

				if (aIndex !== -1 && bIndex !== -1) {
					const temp = newArr[aIndex];
					newArr[aIndex] = newArr[bIndex];
					newArr[bIndex] = temp;
				}

				return newArr;
			});
		}
	}, [events]);

	function handleSort(algo: SortingAlgorithms) {
		const events: SorterEvent[] = [];

		let sorter: Sort | null = null;
		if (algo === "MERGE_SORT") {
			sorter = new MergeSort({
				compareCallback: (aId, bId, result) => {
					if (result === "greater") events.push({ type: "compare", aId, bId });
				},
				moveCallback: (id, blocks) => {
					events.push({ type: "move", id, blocks });
				},
			});
		} else if (algo === "HEAP_SORT") {
			sorter = new HeapSort({
				compareCallback: (aId, bId, result) => {
					if (result === "greater") events.push({ type: "compare", aId, bId });
				},
				swapCallback: (aId, bId) => {
					events.push({ type: "swap", aId, bId });
				},
			});
		}

		if (sorter) {
			sorter.sort(randomArr);
			setEvents(events);
			setIsVisualizing(true);
			if (events.length > 0) {
				setSpeed((60 * 1000) / events.length);
			}
		}
	}

	return (
		<div className="App">
			<div className="py-2 px-4 border-b-2 border-blue-300 bg-slate-400">
				<SortingForm
					barsCount={barsCount}
					setBarsCount={setBarsCount}
					onSort={handleSort}
					disableSubmit={isVisualizing}
				/>
			</div>
			<div className="mt-5">
				<Bars randomArr={randomArr} currentEvent={events[0]} />
			</div>
		</div>
	);
}

export default App;

type SortingAlgorithms = "MERGE_SORT" | "HEAP_SORT";

function SortingForm({
	barsCount,
	setBarsCount,
	onSort,
	disableSubmit = false,
}: {
	barsCount: number;
	setBarsCount: React.Dispatch<React.SetStateAction<number>>;
	onSort(algorith: SortingAlgorithms): void;
	disableSubmit?: boolean;
}) {
	type AlgoOptions = SortingAlgorithms | "";

	const [algo, setAlgo] = React.useState<AlgoOptions>("");

	return (
		<form
			className="w-full flex flex-row justify-between items-center"
			onSubmit={(e) => {
				e.preventDefault();

				if (algo !== "") {
					onSort(algo);
				}
			}}
		>
			<Button
				className="h-fit py-1 rounded-md to-blue-500"
				variant="contained"
				type="submit"
				style={{ color: "white", backgroundColor: "#3b82f6" }}
				disabled={disableSubmit || algo === ""}
			>
				Sort
			</Button>
			<div className="w-10">
				<Slider
					aria-label="Array Size"
					value={barsCount}
					onChange={(e, value) => {
						if (!(value instanceof Array)) {
							setBarsCount(value);
						}
					}}
					min={4}
					max={170}
				/>
			</div>
			<FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
				<InputLabel id="demo-simple-select-standard-label">
					Sorting Algorithm
				</InputLabel>
				<Select
					labelId="demo-simple-select-standard-label"
					id="demo-simple-select-standard"
					value={algo}
					onChange={(e) => setAlgo(e.target.value as AlgoOptions)}
					label="Sorting Algorithm"
				>
					<MenuItem value="">
						<em>None</em>
					</MenuItem>
					<MenuItem value={"MERGE_SORT"}>Merge Sort</MenuItem>
					<MenuItem value={"HEAP_SORT"}>Heap Sort</MenuItem>
				</Select>
			</FormControl>
		</form>
	);
}

function randInRange(min: number, max: number) {
	return +(Math.random() * (max - min) + min).toFixed(0);
}
function getRandNumArr(length: number) {
	const arr = [];
	for (let i = 0; i < length; i++) {
		arr.push({
			val: randInRange(1, 300),
			id: `${Math.random()}${Math.random()}`,
		});
	}

	return arr;
}
