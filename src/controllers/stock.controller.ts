import { Context } from 'hono'

import { fetchAlphaVantage } from '@/lib/alphavantage';

interface IGlobalQuoteResponse {
    "Global Quote": {
        "01. symbol": string;
        "02. open": string;
        "03. high": string;
        "04. low": string;
        "05. price": string;
        "06. volume": string;
        "07. latest trading day": string;
        "08. previous close": string;
        "09. change": string;
        "10. change percent": string;
    };
}

export const notifyStock = async (c: Context) => {
    const symbol = c.req.param("symbol");

    try {
        const data: IGlobalQuoteResponse = await fetchAlphaVantage({
            function: "GLOBAL_QUOTE",
            symbol,
        });

        const globalQuote = data["Global Quote"]

        const price = globalQuote["05. price"]

        return c.json({
            type: 'stock',
            symbol,
            price
        });
    } catch (err) {
        return c.json(
            { error: err instanceof Error ? err.message : "Unknown error" },
            500
        );
    }
}