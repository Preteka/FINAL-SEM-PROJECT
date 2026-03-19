// Using built-in fetch in Node.js 18+


async function testChat() {
    try {
        console.log("Testing chatbot with a general question...");
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "What are some good color ideas for a white kitchen?" })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Test Error:", error.message);
    }
}

testChat();
