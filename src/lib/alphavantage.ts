import { alphaVantageApiKeys } from "@/config/alphaVantage";

const BASE_URL = "https://www.alphavantage.co/query";

type AlphaVantageParams = {
    function: string;
    [key: string]: string | number | undefined;
};

function getRandomKey(exclude: string[] = []) {
    const available = alphaVantageApiKeys.filter((key) => !exclude.includes(key));

    if (available.length === 0) {
        throw new Error("No AlphaVantage API keys available");
    }

    return available[Math.floor(Math.random() * available.length)];
}

export async function fetchAlphaVantage(
    params: AlphaVantageParams,
    attemptedKeys: string[] = []
): Promise<any> {
    if (alphaVantageApiKeys.length === 0) {
        throw new Error("No AlphaVantage API keys configured");
    }

    const apiKey = getRandomKey(attemptedKeys);

    const searchParams = new URLSearchParams({
        ...Object.fromEntries(
            Object.entries(params).map(([k, v]) => [k, String(v)])
        ),
        apikey: apiKey,
    });

    const url = `${BASE_URL}?${searchParams.toString()}`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Alpha Vantage request failed: ${res.status}`);
    }

    const data = await res.json();

    // Rate limit hit
    if (data["Note"]) {
        console.warn(`Rate limit hit for key: ${apiKey}`);

        // Try another key if available
        return fetchAlphaVantage(params, [...attemptedKeys, apiKey]);
    }

    if (data["Error Message"]) {
        throw new Error(data["Error Message"]);
    }

    return data;
}
