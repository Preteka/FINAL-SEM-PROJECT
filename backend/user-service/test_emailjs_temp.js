import fetch from 'node-fetch'; // Or just use global fetch in Node 18+

async function testEmailJS() {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            service_id: 'service_597smdc',
            template_id: 'template_jwzl1e8',
            user_id: 'U0g0aGGHpVzKDiuuh',
            accessToken: 'UKckuCB4mFtllz8SraxSg',
            template_params: {
                to_email: 'test@example.com',
                otp: '123456'
            }
        })
    });

    if (response.ok) {
        console.log('Success:', await response.text());
    } else {
        console.error('Error:', response.status, await response.text());
    }
}

testEmailJS();
