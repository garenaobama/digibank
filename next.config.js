/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add other configurations here if they exist
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig; 