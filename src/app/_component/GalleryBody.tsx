"use client";

import clsx from "clsx";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DiagnosticImages } from "@/model/image";

function GalleryBody() {
	const GridNumberRange = ["1", "2", "3", "4"] as const;
	type GridNumber = (typeof GridNumberRange)[number];
	const [images, setImages] = useState<DiagnosticImages[]>([]);
	const [selectedGrid, setSelectedGrid] = useState<GridNumber>();
	const SCREEN_SIZE = {
		xsm: 360,
		md: 768,
		xl: 1280,
		xxl: 1440,
	};

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get<DiagnosticImages[]>("https://picsum.photos/v2/list");
			setImages(response.data);
		};
		fetchData();
	}, []);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;

			let newBreakPoint: GridNumber = "4";
			if (width < SCREEN_SIZE.xsm) {
				newBreakPoint = "1";
			} else if (width < SCREEN_SIZE.md) {
				newBreakPoint = "2";
			} else if (width < SCREEN_SIZE.xl) {
				newBreakPoint = "3";
			}
			if (newBreakPoint !== selectedGrid) {
				setSelectedGrid(newBreakPoint);
			}
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize); //언마운트시 remove...
		};
	}, [selectedGrid]);

	//해당 배열 4행 grid로 만들기
	return (
		<div className={"full flex-1 p-6"}>
			<div
				className={clsx("grid gap-3", {
					"grid-cols-1": selectedGrid === "1",
					"grid-cols-2": selectedGrid === "2",
					"grid-cols-3": selectedGrid === "3",
					"grid-cols-4": selectedGrid === "4",
				})}
			>
				{images.map((image) => (
					<div
						key={image.id}
						className={"bg-gray-200 border-gray-300 rounded-lg aspect-video flex items-center justify-center"}
					>
						<Image src={image.download_url} alt={"photo"} className={"object-cover"} width={200} height={300} />
					</div>
				))}
			</div>
		</div>
	);
}

export default GalleryBody;
