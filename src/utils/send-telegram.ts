type Props = {
    chat_id: string;
    text: string;
}

export async function sendTelegram({ chat_id, text }: Props) {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id,
            text,
        }),
    })
    return response.json()
}