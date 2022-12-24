import React from "react";
import { ArrItem } from "../algorithms/Comparator";
import { SorterEvent } from "../App";

function Bars({
	randomArr,
	currentEvent,
}: {
	randomArr: ArrItem[];
	currentEvent?: SorterEvent;
}) {
	const len = randomArr.length;
	const ulMaxWidth =
		window.innerWidth - 28 > 872 ? 872 : window.innerWidth - 28; // 28 for 28 px padding around
	const ulActualWidth =
		len * 12 - len + 1; /* for gap of 1px and width of 11px*/
	const liWidth = Math.floor(
		ulActualWidth > ulMaxWidth ? (ulMaxWidth - len) / len : 12
	);

	return (
		<div className="w-full flex justify-center px-2 rotate-180">
			<ul
				className={`w-full grid grid-flow-col justify-center`}
				style={{ columnGap: liWidth === 0 ? "0.5px" : `1px` }}
			>
				{randomArr.map((item, i) => {
					const color = getBarsColor(item, currentEvent);
					return (
						<li
							className={`${color}`}
							style={{
								height: `${item.val}px`,
								width: liWidth === 0 ? "1px" : liWidth + "px",
							}}
							key={item.id}
						></li>
					);
				})}
			</ul>
		</div>
	);

	function getBarsColor(item: ArrItem, currentEvent?: SorterEvent) {
		if (!currentEvent) return "bg-blue-400";
		switch (currentEvent.type) {
			case "compare":
				if (item.id === currentEvent.aId || item.id === currentEvent.bId) {
					console.log(currentEvent.willSwap);
					if (currentEvent.willSwap) return "bg-red-400";
					return "bg-green-400";
				}
				break;
			case "swap":
				if (item.id === currentEvent.aId || item.id === currentEvent.bId)
					return "bg-yellow-400";
				break;
			case "move":
				if (currentEvent.id === item.id) return "bg-yellow-400";
				break;
			default:
				break;
		}

		return "bg-blue-400";
	}
}

export default Bars;
