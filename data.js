// data.js
console.log("📦 data.js is loading...");

// ===============================
// COMPONENTS DATA
// ===============================

const componentsData = [
    { 
        id: "angle-clip",
        title: "Angle Clip",
        thumbnail: "Assets/Components/Angle Clip/thumbnail.jpg",

        images: [
            "Assets/Components/Angle Clip/Angle Clip 1.JPG",
            "Assets/Components/Angle Clip/Angle Clip 2.JPG",
            "Assets/Components/Angle Clip/Angle Clip 3.JPG",
            "Assets/Components/Angle Clip/Angle Clip 4.JPG",
            "Assets/Components/Angle Clip/Angle Clip 5.JPG",
            "Assets/Components/Angle Clip/Angle Clip 6.JPG"
        ],

        videos: [
            "Assets/Components/Angle Clip/Angle Clip.mp4"
        ],

        drawing: [
            "Assets/Components/Angle Clip/Angle Clip.pdf"
        ],

        // MUST always be array for dynamic model viewer
        model3d: ["Assets/Components/Angle Clip/Angle_Clip.gltf"]
    },
    // Add more components here...
    {
        id: "bracket-mount",
        title: "Bracket Mount",
        thumbnail: "Assets/Components/Bracket Mount/thumbnail.jpg",

        images: [
            "Assets/Components/Bracket Mount/Bracket Mount 1.JPG",
            "Assets/Components/Bracket Mount/Bracket Mount 2.JPG"
        ],

        videos: [],

        drawing: [
            "Assets/Components/Bracket Mount/Bracket Mount.pdf"
        ],

        model3d: [
            "Assets/Components/Bracket Mount/Bracket Mount.glb"
        ]
    }
];

// ===============================
// ASSEMBLIES DATA
// ===============================

const assembliesData = [
    {
        id: "geneva-wheel",
        title: "Geneva Wheel",
        thumbnail: "Assets/Assemblies/Geneva-Wheel/thumbnail.jpg",

        images: [
            "Assets/Assemblies/Geneva-Wheel/image1.jpg",
            "Assets/Assemblies/Geneva-Wheel/image2.jpg"
        ],

        videos: [],

        // MUST be array (not empty string)
        drawing: [],

        // MUST be array (not empty string)
        model3d: []
    }
];

// ===============================
// MAKE DATA AVAILABLE GLOBALLY
// ===============================

window.componentsData = componentsData;
window.assembliesData = assembliesData;

console.log("✅ Data loaded successfully:", {
    components: componentsData.length,
    assemblies: assembliesData.length,
    total3DModels: componentsData.filter(c => c.model3d && c.model3d.length).length
});

// Export for debugging
window.debugData = {
    components: componentsData,
    assemblies: assembliesData
};