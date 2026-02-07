// Regex Verification
const urls = [
    "https://res.cloudinary.com/dytty2qzo/image/upload/v1737803158/products/image_name.png",
    "https://res.cloudinary.com/dytty2qzo/image/upload/v12345/image_in_root.png",
    "http://res.cloudinary.com/dytty2qzo/image/upload/folder/subfolder/image.jpg"
];

const regex = /\/v\d+\/(.+)\.[^.]+$/;

urls.forEach(url => {
    const match = url.match(regex);
    if (match && match[1]) {
        console.log(`URL: ${url} -> Public ID: ${match[1]}`);
    } else {
        console.log(`URL: ${url} -> No match`);
    }
});
