"use client";

import { svg } from "@/image";
import Image from "next/image";
import clsx from "clsx";

export type GridNumber = (typeof GridNumberRange)[number];
const GridNumberRange = ["1", "2", "3", "4"] as const;

interface Props {
	onGridClick: (grid: GridNumber) => void;
	onGridSelected: GridNumber;
}

const GalleryTabs = ({ onGridClick, onGridSelected }: Props) => {
	return (
		<div className={"bg-gray-50 py-4 px-6 flex justify-end"}>
			<div className={"flex gap-x-1.5"}>
				{GridNumberRange.map((gridNum) => {
					const url = GRID_ICON_URL_INFOS[gridNum];
					const isSelected = onGridSelected == gridNum;
					return (
						<button
							key={gridNum}
							onClick={() => {
								onGridClick(gridNum);
							}}
							className={clsx("w-8 h-8 p-1 border border-1 rounded", {
								"bg-primary-500 border-primary-500": isSelected,
								"bg-white border-gray-200": !isSelected,
							})}
						>
							<Image className={"w-6 h-auto"} src={isSelected ? url.active : url.unActive} alt={`GridNum${gridNum}`} />
						</button>
					);
				})}
			</div>
		</div>
	);
};

const GRID_ICON_URL_INFOS: Record<GridNumber, { active: string; unActive: string }> = {
	"1": {
		active: svg.gridButtonOneWhite,
		unActive: svg.gridButtonOneGray,
	},
	"2": {
		active: svg.gridButtonTwoWhite,
		unActive: svg.gridButtonTwoGray,
	},
	"3": {
		active: svg.gridButtonThreeWhite,
		unActive: svg.gridButtonThreeGray,
	},
	"4": {
		active: svg.gridButtonFourWhite,
		unActive: svg.gridButtonFourGray,
	},
};

export default GalleryTabs;
