import { Context } from 'hono'

import { fetchAlphaVantage } from '@/lib/alphavantage';

import { sendEmail } from '@/utils/send-email';
import { sendTelegram } from '@/utils/send-telegram';

const TO_EMAILS = [
    "sudhanshuneravati@gmail.com",
    "voltantroyer2@gmail.com"
]

const TELEGRAM_CHAT_ID = "6017868912"

export const notifyPrecious = async (c: Context) => {
    const symbol = c.req.param("symbol")?.toUpperCase();

    const allowedSymbols = ["GOLD", "SILVER"];
    if (!allowedSymbols.includes(symbol)) {
        return c.json(
            { error: `Invalid symbol. Must be one of: ${allowedSymbols.join(", ")}` },
            400
        );
    }

    try {
        const data = await fetchAlphaVantage({
            function: "GOLD_SILVER_SPOT",
            symbol,
        });

        const currencyData = await fetchAlphaVantage({
            function: "CURRENCY_EXCHANGE_RATE",
            from_currency: "USD",
            to_currency: "INR",
        });

        const currencyRate = currencyData["Realtime Currency Exchange Rate"]["5. Exchange Rate"];

        const price = data.price * currencyRate;

        const message = `
        ${symbol} Price in ${currencyData["Realtime Currency Exchange Rate"]["3. To_Currency Code"]}

        Current Price: ${price}
        Currency Rate: USD to INR ${currencyRate}

        Checked at: ${new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
        })}
        Source: Alpha Vantage
        `

        await sendEmail({
            to: TO_EMAILS,
            subject: `${symbol} Price`,
            text: message,
        })

        await sendTelegram({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
        })

        return c.json({
            type: 'precious',
            symbol,
            price,
            message
        });
    } catch (err) {
        return c.json(
            { error: err instanceof Error ? err.message : "Unknown error" },
            500
        );
    }
};
