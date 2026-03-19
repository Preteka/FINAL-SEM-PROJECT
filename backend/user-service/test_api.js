async function testAPI() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'adminvinayaga@gmail.com' })
        });
        const data = await response.json();
        console.log('Status code:', response.status);
        console.log('Response body:', data);
    } catch (err) {
        console.error('Network Error:', err);
    }
}
testAPI();
