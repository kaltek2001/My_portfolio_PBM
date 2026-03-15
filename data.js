// data.js
console.log("📦 data.js is loading...");

// ===============================
// COMPONENTS DATA
// ===============================

const componentsData = [
    { 
        id: "angle-clip",
        title: "Angle Clip",
        thumbnail: "Assets/Components/Angle Clip/Thumbnail.JPG",

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
        thumbnail: "Assets/Components/Control Bracket Casting/Thumbnail.JPG",

        images: [
            "Assets/Components/Control Bracket Casting/Control Bracket Casting 1.JPG",
            "Assets/Components/Control Bracket Casting/Control Bracket Casting 2.JPG",
            "Assets/Components/Control Bracket Casting/Control Bracket Casting 3.JPG",
            "Assets/Components/Control Bracket Casting/Control Bracket Casting 4.JPG",
            "Assets/Components/Control Bracket Casting/Control Bracket Casting 5.JPG",
            "Assets/Components/Control Bracket Casting/Control Bracket Casting 6.JPG"
        ],

        videos: [],

        drawing: [
            "Assets/Components/Control Bracket Casting/Control Bracket Casting.pdf"
        ],

        model3d: [
            "Assets/Components/Control Bracket Casting/Control_Bracket_Casting.gltf"
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
        thumbnail: "Assets/Assemblies/Geneva Wheel/Thumbnail.JPG",

        images: [
            "Assets/Assemblies/Geneva Wheel/Base.JPG",
            "Assets/Assemblies/Geneva Wheel/Geneva Gear.JPG",
            "Assets/Assemblies/Geneva Wheel/Geneva Wheel.JPG",
            "Assets/Assemblies/Geneva Wheel/Shoulder Bolt.JPG",
            "Assets/Assemblies/Geneva Wheel/Whiz Nut.JPG",
            "Assets/Assemblies/Geneva Wheel/Wheel.JPG"
            
        ],

        videos: ["Assets/Assemblies/Geneva Wheel/Geneva Wheel.mp4"],

        // MUST be array (not empty string)
        drawing: ["Assets/Assemblies/Geneva Wheel/Shoulder Bolt.pdf",
            "Assets/Assemblies/Geneva Wheel/Wheel.pdf",
            "Assets/Assemblies/Geneva Wheel/Whiz Nut.pdf"
        ],

        // MUST be array (not empty string)
        model3d: ["Assets/Assemblies/Geneva Wheel/Base.gltf",
            "Assets/Assemblies/Geneva Wheel/Geneva_Gear.gltf",
            "Assets/Assemblies/Geneva Wheel/Shoulder_Bolt.gltf",
            "Assets/Assemblies/Geneva Wheel/Whiz_Nut.gltf",
            "Assets/Assemblies/Geneva Wheel/Wheel.gltf",
            "Assets/Assemblies/Geneva Wheel/Geneva_Wheel.gltf"
        ]
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