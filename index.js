const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const builder = new addonBuilder({
    id: "org.mivexia.test",
    version: "1.0.0",
    name: "Mivexia's Test Addon",
    description: "Watch object shows from YouTube.",

    resources: ["stream"],
    types: ["movie", "series"], 
    catalogs: []
});

// Full map of all 6 seasons and their exact episode counts
const episodeLinks = {
    "1": { // Season 1 (25 episodes)
        "1": "4sWfDOkM-zA", "2": "JfzEO9-Zlhw", "3": "rhkgOXksmaY", "4": "cdmVPHdpECM", "5": "xHI-iKm31us", "6": "6vGgsXO57bs", "7": "Ze1p7bYXw0g", "8": "g0wCF04ddnw", "9": "ylVsfdU5pxo", "10": "Eg5Ja23HfhY",
        "11": "yhkDgX2b7po", "12": "U4sp10HUI6Y", "13": "BQBmKvRd0B0", "14": "yZqh3l3-pTM", "15": "pf9FHBM0SLQ", "16": "nAKk0gm73K0", "17": "Xmh7M7TXDRE", "18": "x4K1xKHwp0E", "19": "4pR6Y3_ahS8", "20": "J9udiROQchg",
        "21": "6OfKK5Rt3fY", "22": "GfFkiGgY6Pk", "23": "KLwgTM7HBhw", "24": "PigChYq_FrM", "25": "ye_HKD_C5o0"
    },
    "2": { // Season 2 (25 episodes)
        "1": "26FJTtLOu2s", "2": "hsprecnxSsE", "3": "dXUE7OFij_I", "4": "E174ogB49xs", "5": "sAcIKTtbnP0", "6": "qGqde_06qj8", "7": "kTcfak9R-ok", "8": "kuh1rlW4OyQ", "9": "S2JV2nT_5FM", "10": "lcObRZOVdRM",
        "11": "qNKPTAEzXTw", "12": "S9NCSb6wAU8", "13": "T2NuWcd0t_U", "14": "RO3ujKZo96c", "15": "kVCpKBP9hoo", "16": "8xdb6iS_uRY", "17": "WGgLMJsimE8", "18": "bkqv3uPIWOg", "19": "azNk6M0-mto", "20": "Q-Angwav-uI",
        "21": "oPFuC7IcTiU", "22": "b8vUzNczUbo", "23": "Z7BX7lUbPF0", "24": "oHDj5YSKOYM", "25": "hTK2jHPtv5o"
    },
    "3": { // Season 3 (1 episode)
        "1": "2Jw0dhwmi3o"
    },
    "4": { // Season 4 (30 episodes)
        "1": "m_7nnajnaI8", "2": "5X8AC3rBRG0", "3": "AiBqyXNtOEs", "4": "MiZ8V3NHwfM", "5": "K-JvpRzBmBA", "6": "ES9CvQRJqRM", "7": "SDaS5VNbVOo", "8": "v0aB4IWiDfs", "9": "ukj5Rnr-nX8", "10": "DGIZyD5-5gE",
        "11": "X7ZoFJhBE5o", "12": "KOUP8AGYdr8", "13": "QmP-K0zVoR0", "14": "FDoY1zaWB4I", "15": "gI40pUTzGPI", "16": "gs3lqEJHSnA", "17": "oav0TXI6bqc", "18": "8HATkU_F0iE", "19": "1YwDVqaszdU", "20": "gu8nQFHHD9w",
        "21": "fpnp3jRxRTs", "22": "wluh0U2wZuY", "23": "UUwZw_y6kpQ", "24": "PRQP-UPy6cQ", "25": "uVIXVFZOxKQ", "26": "5qSmQuBma3c", "27": "mHq89x2z2Lc", "28": "bVTyUTDSF9A", "29": "nVQqDcKAmzg", "30": "KRUHJDB75IE"
    },
    "5": { // Season 5 (23 episodes)
        "1": "_LDFLwqXJXs", "2": "W7ojCVtiTUc", "3": "j5betOWzPpA", "4": "p60LYcUJUXU", "5": "Famz84APAXY", "6": "yjuwsaz7x4o", "7": "3lLlhECn6H8", "8": "xXvSiWCCvhQ", "9": "Mv8EPmY3HNE", "10": "VjZXR9MM_P8",
        "11": "5UqZqXhaRQw", "12": "1nxS-KYiDmk", "13": "OEuYHlSMXMM", "14": "bpsoMEaNoVE", "15": "CHKP0oghspg", "16": "JqmI70XeC04", "17": "gCQXXS8exng", "18": "yyjAYG89-N0", "19": "VrsdG8wJGAg", "20": "D4dSs-iU1ac",
        "21": "UijLfadxH44", "22": "d5mjgRpyOTQ", "23": "9YbXxSUkweo"
    },
    "6": { // Season 6 (10 episodes)
        "1": "lgygCENldD0", "2": "bnzOL9v5Pn0", "3": "DKq0IjNhyKU", "4": "s-_GwW1bNoY", "5": "r3SMDnxT3aE", "6": "dTBnk-Vgfvg", "7": "tVX0gCVjN7s", "8": "mS6sWXH1aQw", "9": "lUuKvJlTaA8", "10": "O4iixZEv_HA"
    }
};

builder.defineStreamHandler(({ type, id }) => {
    if (type === "series" && id.startsWith("tt5747554")) {
        const parts = id.split(":"); 
        const season = parts[1];   
        const episode = parts[2];  

        // Check if we have a stream link configured for this season and episode, 
        // AND ensure it isn't just an empty string placeholder
        if (episodeLinks[season] && episodeLinks[season][episode] && episodeLinks[season][episode] !== "") {
            const ytId = episodeLinks[season][episode];
            
            return Promise.resolve({
                streams: [
                    {
                        title: `Watch Season ${season} Episode ${episode} on YouTube`,
                        ytId: ytId
                    }
                ]
            });
        }
    }

    return Promise.resolve({ streams: [] });
});

serveHTTP(builder.getInterface(), {
    port: process.env.PORT || 7000
});

