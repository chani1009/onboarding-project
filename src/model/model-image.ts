import staffClient from "@/model/client";

export const getImagesList = async (limit: number) => {
	const getRandomPage = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	const page = getRandomPage(1, 50);
	const { data } = await staffClient.get("list", { params: { page, limit } });

	return data;
};
