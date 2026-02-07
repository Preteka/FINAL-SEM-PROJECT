// Regex Verification Improved
const urls = [
    "https://res.cloudinary.com/dytty2qzo/image/upload/v1737803158/products/image_name.png",
    "https://res.cloudinary.com/dytty2qzo/image/upload/v12345/image_in_root.png",
    // Testing without version number which sometimes happens or different structures
    "http://res.cloudinary.com/dytty2qzo/image/upload/products/sub/image.jpg"
];

// The goal is to capture everything after confirming it is a cloudinary upload URL, specifically after 'upload/' and version 'v1234/'
// Standard Cloudinary format: .../upload/v<version>/<public_id>.<format>
// OR .../upload/<public_id>.<format> (if version is omitted, though less common in delivered URLs)

const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;

console.log("--- Regex Test Results ---");
urls.forEach(url => {
    const match = url.match(regex);
    if (match && match[1]) {
        console.log(`URL: ${url} \n   -> Public ID: ${match[1]}`);
    } else {
        console.log(`URL: ${url} \n   -> No match`);
    }
});
