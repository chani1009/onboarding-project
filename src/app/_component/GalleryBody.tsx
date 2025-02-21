"use client";

import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, DragEvent } from "react";
import { DiagnosticImages } from "@/model/image";
import GalleryTabs, { GridNumber } from "@/app/_component/GalleryTabs";
import { getImagesList } from "@/model/model-image";

const GalleryBody = () => {
	const router = useRouter();
	const [images, setImages] = useState<DiagnosticImages[]>([]);
	const [selectedGrid, setSelectedGrid] = useState<GridNumber>("4");
	const [breakPoint, setBreakPoint] = useState<GridNumber>("4");
	const SCREEN_SIZE = {
		xsm: 360,
		md: 768,
		xl: 1280,
		xxl: 1440,
	};

	const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
		e.dataTransfer.setData("dragIndex", index.toString());
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
		const dragIndex = Number(e.dataTransfer.getData("dragIndex"));
		const updatedImages = [...images];
		const [draggedImage] = updatedImages.splice(dragIndex, 1);
		updatedImages.splice(dropIndex, 0, draggedImage);

		setImages(updatedImages);
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault(); // 드롭 가능하도록 설정
	};

	const { data, refetch } = useQuery({ queryKey: ["images"], queryFn: () => getImagesList(20) });

	useEffect(() => {
		if (data) {
			setImages(data);
		}
	}, [data]);

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
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div className={"h-full w-full"}>
			<GalleryTabs
				onRefreshClick={async () => {
					await refetch();
				}}
				onGridClick={(gridNumber: GridNumber) => {
					setSelectedGrid(gridNumber);
				}}
				onGridSelected={selectedGrid}
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
					{images.map((image, index) => (
						<div
							key={image.id}
							draggable={true}
							onClick={() => router.push(`/gallery-detail1?url=${image.download_url}`)}
							onDragStart={(e) => {
								handleDragStart(e, index);
							}}
							onDragOver={handleDragOver}
							onDrop={(e) => {
								handleDrop(e, index);
							}}
							className={"bg-gray-200 border-gray-300 rounded-lg aspect-video overflow-hidden"}
						>
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
