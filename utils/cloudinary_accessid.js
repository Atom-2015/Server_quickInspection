const extractPublicIdFromUrl = (cloudinaryUrl) => {
    const regex = /\/upload\/([^\/]+)\/([^\/]+)\.[a-zA-Z]{3,4}$/; // Regex to extract publicId
    const match = cloudinaryUrl.match(regex);
    const publicId = match && match[2] ? match[2] : null;
    return publicId;
};

module.exports = extractPublicIdFromUrl;
