async function testAuthFallback() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: 'test_fallback@example.com' })
        });

        const data = await response.json();
        console.log('Status Code:', response.status);
        console.log('Response Body:', data);
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

testAuthFallback();
