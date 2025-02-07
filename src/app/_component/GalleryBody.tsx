"use client";

import clsx from "clsx";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DiagnosticImages } from "@/model/image";
import GalleryTabs, { GridNumber } from "@/app/_component/GalleryTabs";

const GalleryBody = () => {
	const [images, setImages] = useState<DiagnosticImages[]>([]);
	const [selectedGrid, setSelectedGrid] = useState<GridNumber>("4");
	const [breakPoint, setBreakPoint] = useState<GridNumber>("4");
	const SCREEN_SIZE = {
		xsm: 360,
		md: 768,
		xl: 1280,
		xxl: 1440,
	};

	useEffect(() => {
		const fetchData = async () => {
			const getRandomPage = (min: number, max: number) => {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			};
			const randomPage = getRandomPage(1, 50);
			const response = await axios.get<DiagnosticImages[]>(`https://picsum.photos/v2/list?page=${randomPage}&limit=20`);
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
			if (newBreakPoint !== breakPoint) {
				setBreakPoint(newBreakPoint);
				setSelectedGrid(newBreakPoint);
			}
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize); //언마운트시 remove...
		};
	}, [selectedGrid]);

	return (
		<div className={"h-full w-full"}>
			<GalleryTabs
				onGridSelected={selectedGrid}
				onGridClick={(gridNumber: GridNumber) => {
					setSelectedGrid(gridNumber);
				}}
			/>
			<div className={"full flex-1 py-6 px-16"}>
				<div
					className={clsx("grid gap-3", {
						"grid-cols-1": selectedGrid === "1",
						"grid-cols-2": selectedGrid === "2",
						"grid-cols-3": selectedGrid === "3",
						"grid-cols-4": selectedGrid === "4",
					})}
				>
					{images.map((image) => (
						<div key={image.id} className={"bg-gray-200 border-gray-300 rounded-lg aspect-video overflow-hidden"}>
							<Image
								src={image.download_url}
								alt={"photo"}
								className={"object-cover h-full w-full"}
								width={200}
								height={300}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default GalleryBody;
