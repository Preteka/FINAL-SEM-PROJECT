import fetch from 'node-fetch';

async function testRegistration() {
    const testEmail = `test_no_otp_${Date.now()}@example.com`;
    console.log(`Testing registration for: ${testEmail}`);

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                name: 'Test Automation'
            })
        });

        const data = await response.json();
        console.log('Status Code:', response.status);
        console.log('Response:', data);

        if (response.ok && data.success) {
            console.log('SUCCESS: User registered without OTP.');
        } else {
            console.error('FAILED: Registration did not work as expected.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testRegistration();
