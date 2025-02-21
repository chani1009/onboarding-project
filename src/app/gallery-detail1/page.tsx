"use client";

import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Point {
	x: number;
	y: number;
}

const GalleryDetail = () => {
	const pointRadius = 10;
	const searchParams = useSearchParams();
	const bgCanvasRef = useRef<HTMLCanvasElement>(null);
	const drawCanvasRef = useRef<HTMLCanvasElement>(null);
	const undoStack = useRef<Point[][]>([]);
	const draggingIndex = useRef<number | null>(null);
	const isDragging = useRef<boolean>(false);
	const [points, setPoints] = useState<Point[]>([]);
	const [isDrawPoint, setDrawPoint] = useState(false);
	const [canvasElement, setCanvasElement] = useState<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }>();
	const [vertexCnt, setVertexCnt] = useState<number>(0);

	const getPoint = (e: MouseEvent) => {
		if (!canvasElement) return;
		const rect = canvasElement.canvas.getBoundingClientRect();
		const returnPoint: Point = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};
		return returnPoint;
	};

	const getDistance = (pointA: Point, pointB: Point) => {
		const dx = pointA.x - pointB.x;
		const dy = pointA.y - pointB.y;
		return Math.sqrt(dx * dx + dy * dy);
	};

	const isFirstPoint = (points: Point[], clickedPoint: Point) => {
		if (points.length < 3) return false;
		if (getDistance(points[0], clickedPoint) <= pointRadius) {
			setDrawPoint(true);
			return true;
		}
	};

	const arePointsEqual = (undoStackPoints: Point[], prevPoints: Point[]) => {
		if (undoStackPoints.length !== prevPoints.length) return false;
		for (let i = 0; i < undoStackPoints.length; i++) {
			if (undoStackPoints[i].x !== prevPoints[i].x || undoStackPoints[i].y !== prevPoints[i].y) return false;
		}
		return true;
	};

	const drawDots = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.arc(x, y, 3, 0, Math.PI * 2);
		ctx.fill();
	};

	const drawPolygon = (ctx: CanvasRenderingContext2D) => {
		ctx.beginPath();
		points.forEach(({ x, y }) => ctx.lineTo(x, y));
		ctx.closePath();
		ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
		ctx.fill();
		ctx.strokeStyle = "blue";
		ctx.lineWidth = 2;
		ctx.stroke();

		setVertexCnt(points.length);
	};

	// 캔버스 요소와 컨텍스트 설정
	useEffect(() => {
		const canvas = drawCanvasRef.current;
		if (canvas) {
			const canvasContext = canvas.getContext("2d");
			if (canvasContext) {
				setCanvasElement({ canvas, ctx: canvasContext });
			}
		}
	}, [drawCanvasRef]);

	// 배경 이미지 로드
	useEffect(() => {
		const bgCanvas = bgCanvasRef.current;
		if (bgCanvas) {
			const bgCanvasCtx = bgCanvas.getContext("2d");
			const imgUrl = searchParams.get("url") as string;
			const img = new Image();
			img.src = imgUrl;
			img.onload = () => {
				bgCanvasCtx?.drawImage(img, 0, 0, bgCanvas.width, bgCanvas.height);
			};
		}
	}, []);

	// 클릭 시 새 점 추가 (드래그 중이 아닐 때 / 첫번째 점을 안찍었을때)
	useEffect(() => {
		if (!canvasElement) return;
		const handleCanvasClick = (e: MouseEvent) => {
			const point = getPoint(e);
			if (!point) return;
			if (isDragging.current) return;

			setPoints((prevPoints) => {
				if (isFirstPoint(prevPoints, point)) {
					return [...prevPoints];
				} else {
					if (
						undoStack.current.length === 0 ||
						!arePointsEqual(undoStack.current[undoStack.current.length - 1], prevPoints)
					) {
						undoStack.current.push([...prevPoints]);
					}
					return [...prevPoints, point];
				}
			});
		};
		canvasElement.canvas.addEventListener("click", handleCanvasClick);
		return () => {
			canvasElement.canvas.removeEventListener("click", handleCanvasClick);
		};
	}, [canvasElement]);

	useEffect(() => {
		if (!canvasElement) return;
		const canvas = canvasElement.canvas;

		const handleMouseDown = (e: MouseEvent) => {
			const clickedPoint = getPoint(e);
			if (!clickedPoint) return;
			let foundIndex: number | null = null;
			for (let i = 0; i < points.length; i++) {
				if (isDrawPoint && getDistance(points[i], clickedPoint) < pointRadius) {
					foundIndex = i;
					break;
				}
			}

			if (foundIndex !== null) {
				draggingIndex.current = foundIndex;
				undoStack.current.push([...points]); //드래그 잡았을때의 점 상태를 저장해줘야함
				e.preventDefault();
				e.stopPropagation();
			}
		};

		const handleMouseMove = (e: MouseEvent) => {
			const movedPoint = getPoint(e);
			if (!movedPoint) return;
			if (draggingIndex.current === null) return;
			isDragging.current = true;

			setPoints((prevPoints) => {
				const newPoints = [...prevPoints];
				newPoints[draggingIndex.current!] = movedPoint;
				return newPoints;
			});
		};

		const handleMouseUp = () => {
			if (isDragging.current) {
				draggingIndex.current = null;
			}
		};

		canvas.addEventListener("mousedown", handleMouseDown);
		canvas.addEventListener("mousemove", handleMouseMove);
		canvas.addEventListener("mouseup", handleMouseUp);
		canvas.addEventListener("mouseleave", handleMouseUp);

		return () => {
			canvas.removeEventListener("mousedown", handleMouseDown);
			canvas.removeEventListener("mousemove", handleMouseMove);
			canvas.removeEventListener("mouseup", handleMouseUp);
			canvas.removeEventListener("mouseleave", handleMouseUp);
		};
	}, [points, isDrawPoint]);

	useEffect(() => {
		if (!canvasElement) return;
		canvasElement.ctx.clearRect(0, 0, canvasElement.canvas.width, canvasElement.canvas.height);
		points.forEach((point) => {
			drawDots(canvasElement.ctx, point.x, point.y);
		});
	}, [points]);

	useEffect(() => {
		if (!canvasElement) return;
		if (isDrawPoint && (vertexCnt == 0 || vertexCnt == points.length)) {
			drawPolygon(canvasElement.ctx);
		} else {
			setDrawPoint(false);
			setVertexCnt(0);
		}
	}, [points]);

	const onClickDelete = () => {
		setPoints([]);
		setDrawPoint(false);
		isDragging.current = false;
	};

	const handleUndo = () => {
		if (undoStack.current.length === 0) return;
		const prevPoints = undoStack.current.pop();
		if (prevPoints) setPoints(prevPoints);
		isDragging.current = false;
	};

	const drawPolygonByBtn = () => {
		if (!canvasElement) return;
		drawPolygon(canvasElement.ctx);
		setDrawPoint(true);
	};

	return (
		<div className="w-full">
			<div className="bg-primary-500 mb-5">
				<button onClick={onClickDelete}>지우기</button>
				<button onClick={handleUndo} className={"mx-4"}>
					undo
				</button>
				<button onClick={drawPolygonByBtn}>딸각</button>
			</div>
			<div className="relative flex justify-center">
				<canvas ref={bgCanvasRef} width={800} height={400} className="absolute"></canvas>
				<canvas ref={drawCanvasRef} width={800} height={400} className="absolute"></canvas>
			</div>
		</div>
	);
};

export default GalleryDetail;
