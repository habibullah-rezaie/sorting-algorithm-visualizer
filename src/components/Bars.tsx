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
	return (
		<div className="flex flex-row justify-center">
			<ul className="flex flex-row space-x-1">
				{randomArr.map((item, i) => (
					<li
						className={`w-3 ${
							!currentEvent
								? "bg-blue-400"
								: (currentEvent.type === "compare" ||
										currentEvent.type === "swap") &&
								  (item.id === currentEvent.aId || item.id === currentEvent.bId)
								? "bg-red-400"
								: "bg-blue-400"
						}`}
						style={{ height: `${item.val}px` }}
						key={item.id}
					></li>
				))}
			</ul>
		</div>
	);
}

export default Bars;
