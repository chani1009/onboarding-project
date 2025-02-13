"use client";

import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const GalleryDetail = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const searchParams = useSearchParams();
	const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
	const [canvasElement, setCanvasElement] = useState<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }>();
	const pointRadius = 10;

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const canvasContext = canvas.getContext("2d");
			if (canvasContext) {
				setCanvasElement({ canvas: canvas, ctx: canvasContext });
			}
		}
	}, [canvasRef]);

	const drawImage = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
		const imgUrl = searchParams.get("url") as string;
		const img = new Image();
		img.src = imgUrl;
		img.onload = () => {
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		};
	};

	useEffect(() => {
		if (canvasElement) {
			drawImage(canvasElement.canvas, canvasElement.ctx);
		}
	}, [canvasElement]);

	useEffect(() => {
		const handleCanvasClick = (e: MouseEvent) => {
			if (canvasElement) {
				const rect = canvasElement.canvas.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				setPoints((prevPoints) => [...prevPoints, { x, y }]);
				canvasElement.ctx.fillStyle = "red";
				canvasElement.ctx.beginPath();
				canvasElement.ctx.arc(x, y, 3, 0, Math.PI * 2); //5: 반지름
				canvasElement.ctx.fill();
			}
		};
		canvasElement?.canvas.addEventListener("click", handleCanvasClick);
		return () => {
			canvasElement?.canvas.removeEventListener("click", handleCanvasClick);
		};
	}, [canvasElement]);

	useEffect(() => {
		if (canvasElement) {
			const firstPoint = points[0];
			const lastPoint = points[points.length - 1];

			if (points.length == 0) {
				canvasElement.ctx.clearRect(0, 0, canvasElement.canvas.width, canvasElement.canvas.height);
			} else {
				if (firstPoint && lastPoint) {
					const dx = lastPoint.x - firstPoint.x;
					const dy = lastPoint.y - firstPoint.y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (points.length > 2 && distance <= pointRadius) {
						canvasElement.ctx.beginPath();
						points.forEach(({ x, y }) => canvasElement.ctx.lineTo(x, y));
						canvasElement.ctx.closePath();
						canvasElement.ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
						canvasElement.ctx.fill();
						canvasElement.ctx.strokeStyle = "blue";
						canvasElement.ctx.lineWidth = 2;
						canvasElement.ctx.stroke();
					}
				}
			}
		}
	}, [points]);

	const onClickDelete = () => {
		setPoints([]);
		if (canvasElement) {
			drawImage(canvasElement.canvas, canvasElement.ctx);
		}
	};

	return (
		<div className={"w-full"}>
			<div className={"bg-primary-500 mb-5"}>
				<button onClick={onClickDelete}>지우기</button>
			</div>
			<div className={"h-96 w-full flex justify-center"}>
				{/* width, height는 실제 캔버스 요소 크기를 설정, className은 렌더링된 크기를 정함 -> 맞춰야 점찍는데 문제 안됨..화면 줄어들면..?*/}
				<canvas ref={canvasRef} width={800} height={400} className="w-[800px] h-[400px]"></canvas>
			</div>
		</div>
	);
};

export default GalleryDetail;
