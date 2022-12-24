import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Slider,
	Typography,
} from "@mui/material";
import React from "react";
import HeapSort from "./algorithms/HeapSort";
import { MergeSort } from "./algorithms/MergeSort";
import QuickSort from "./algorithms/QuickSort";
import SelectionSort from "./algorithms/SelectionSort";
import { Sort, SortCallbacks } from "./algorithms/Sort";
import "./App.css";
import Bars from "./components/Bars";

// TODO: change speed based on size as well
// TODO: change width of bar based on size
// TODO: set a fixed width for bar section

(window as any).SelectionSort = SelectionSort;
(window as any).QuickSort = QuickSort;
export type SorterEvent =
	| { type: "compare"; aId: string; bId: string; willSwap: boolean }
	| { type: "swap"; aId: string; bId: string }
	| { type: "visit"; id: string }
	| { type: "move"; id: string; blocks: number };

function App() {
	const [barsCount, setBarsCount] = React.useState(10);
	const [events, setEvents] = React.useState<SorterEvent[]>([]);
	const [isVisualizing, setIsVisualizing] = React.useState(false);
	const [randomArr, setRandomArr] = React.useState(() =>
		getRandNumArr(barsCount)
	);

	const barsCountRef = React.useRef(barsCount);
	React.useEffect(() => {
		if (!isVisualizing && barsCountRef.current !== barsCount) {
			barsCountRef.current = barsCount;
			setRandomArr(getRandNumArr(barsCount));
		}
	}, [barsCount, isVisualizing]);

	React.useEffect(() => {
		if (isVisualizing) {
			const speed = 530 - barsCount * 3; // every bar means 3 ms
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
		}
	}, [barsCount, events, isVisualizing]);

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
		const defaultCallBacks: SortCallbacks = {
			compareCallback: (aId, bId, result, willSwap = false) => {
				events.push({ type: "compare", aId, bId, willSwap });
			},
			swapCallback: (aId, bId) => {
				events.push({ type: "swap", aId, bId });
			},
		};

		switch (algo) {
			case "MERGE_SORT": {
				sorter = new MergeSort({
					...defaultCallBacks,
					moveCallback: (id, blocks) => {
						events.push({ type: "move", id, blocks });
					},
				});
				break;
			}
			case "HEAP_SORT": {
				sorter = new HeapSort({
					...defaultCallBacks,
				});

				break;
			}
			case "QUICK_SORT": {
				sorter = new QuickSort({
					...defaultCallBacks,
				});
				break;
			}
			case "SELECTION_SORT": {
				sorter = new SelectionSort({
					...defaultCallBacks,
				});
				break;
			}
			default:
				break;
		}

		if (sorter) {
			const arr = sorter.sort(randomArr);
			setEvents(events);
			setIsVisualizing(true);
		}
	}

	return (
		<div className="App">
			<div className="py-2 px-4 bg-green-500">
				<SortingForm
					barsCount={barsCount}
					setBarsCount={(count) => {
						if (!isVisualizing) setBarsCount(count);
					}}
					onSort={handleSort}
					disableSubmit={isVisualizing}
					onShuffle={() => {
						setRandomArr(getRandNumArr(barsCount));
						if (isVisualizing) setIsVisualizing(false);
					}}
				/>
			</div>
			<div className="mt-5">
				<Bars randomArr={randomArr} currentEvent={events[0]} />
			</div>
		</div>
	);
}

export default App;

type SortingAlgorithms =
	| "MERGE_SORT"
	| "HEAP_SORT"
	| "QUICK_SORT"
	| "SELECTION_SORT";

function SortingForm({
	barsCount,
	setBarsCount,
	onSort,
	disableSubmit = false,
	onShuffle,
}: {
	barsCount: number;
	setBarsCount: (count: number) => void;
	onSort(algorith: SortingAlgorithms): void;
	disableSubmit?: boolean;
	onShuffle: () => void;
}) {
	type AlgoOptions = SortingAlgorithms | "";

	const [algo, setAlgo] = React.useState<AlgoOptions>("");

	return (
		<form
			className="w-full flex flex-row flex-wrap justify-between items-center space-x-2"
			onSubmit={(e) => {
				e.preventDefault();

				if (algo !== "") {
					onSort(algo);
				}
			}}
		>
			<div className="w-fit flex flex-row space-x-3 items-center">
				<Typography id="slider label" gutterBottom className={"text-black/60"}>
					Array Length
				</Typography>
				<div className="w-10">
					<Slider
						aria-label="Array Length"
						value={barsCount}
						onChange={(_, value) => {
							if (!(value instanceof Array)) {
								setBarsCount(value);
							}
						}}
						min={4}
						max={170}
					/>
				</div>
			</div>
			<FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
				<InputLabel id="algoSelctor">Sorting Algorithm</InputLabel>
				<Select
					labelId="algoSelctor"
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
					<MenuItem value={"QUICK_SORT"}>Quick Sort</MenuItem>
					<MenuItem value={"SELECTION_SORT"}>Selection Sort</MenuItem>
				</Select>
			</FormControl>
			<Button
				className="h-fit py-1 rounded-md"
				variant="contained"
				type="submit"
				style={{ color: "white", backgroundColor: "#3b82f6" }}
				disabled={disableSubmit || algo === ""}
			>
				Sort
			</Button>
			<Button
				className="h-fit py-1 rounded-md"
				variant="contained"
				onClick={onShuffle}
				style={{ color: "white", backgroundColor: "#f87171" }}
			>
				Shuffle
			</Button>
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
