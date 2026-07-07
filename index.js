const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const builder = new addonBuilder({
    id: "com.mivexia.objectshows",
    version: "1.0.0",
    name: "Object Shows",
    description: "Watch object shows in Stremio using YouTube.",

    resources: ["stream"],
    types: ["movie", "series"], 
    catalogs: []
});

// Reorganized to map by [IMDb_ID][Season][Episode]
const showLinks = {
    "tt5747554": { // Battle For Dream Island (BFDI)
        "1": { 
            "1": "4sWfDOkM-zA", "2": "JfzEO9-Zlhw", "3": "rhkgOXksmaY", "4": "cdmVPHdpECM", "5": "xHI-iKm31us", "6": "6vGgsXO57bs", "7": "Ze1p7bYXw0g", "8": "g0wCF04ddnw", "9": "ylVsfdU5pxo", "10": "Eg5Ja23HfhY",
            "11": "yhkDgX2b7po", "12": "U4sp10HUI6Y", "13": "BQBmKvRd0B0", "14": "yZqh3l3-pTM", "15": "pf9FHBM0SLQ", "16": "nAKk0gm73K0", "17": "Xmh7M7TXDRE", "18": "x4K1xKHwp0E", "19": "4pR6Y3_ahS8", "20": "J9udiROQchg",
            "21": "6OfKK5Rt3fY", "22": "GfFkiGgY6Pk", "23": "KLwgTM7HBhw", "24": "PigChYq_FrM", "25": "ye_HKD_C5o0"
        },
        "2": { 
            "1": "26FJTtLOu2s", "2": "hsprecnxSsE", "3": "dXUE7OFij_I", "4": "E174ogB49xs", "5": "sAcIKTtbnP0", "6": "qGqde_06qj8", "7": "kTcfak9R-ok", "8": "kuh1rlW4OyQ", "9": "S2JV2nT_5FM", "10": "lcObRZOVdRM",
            "11": "qNKPTAEzXTw", "12": "S9NCSb6wAU8", "13": "T2NuWcd0t_U", "14": "RO3ujKZo96c", "15": "kVCpKBP9hoo", "16": "8xdb6iS_uRY", "17": "WGgLMJsimE8", "18": "bkqv3uPIWOg", "19": "azNk6M0-mto", "20": "Q-Angwav-uI",
            "21": "oPFuC7IcTiU", "22": "b8vUzNczUbo", "23": "Z7BX7lUbPF0", "24": "oHDj5YSKOYM", "25": "hTK2jHPtv5o"
        },
        "3": { 
            "1": "2Jw0dhwmi3o"
        },
        "4": { 
            "1": "m_7nnajnaI8", "2": "5X8AC3rBRG0", "3": "AiBqyXNtOEs", "4": "MiZ8V3NHwfM", "5": "K-JvpRzBmBA", "6": "ES9CvQRJqRM", "7": "SDaS5VNbVOo", "8": "v0aB4IWiDfs", "9": "ukj5Rnr-nX8", "10": "DGIZyD5-5gE",
            "11": "X7ZoFJhBE5o", "12": "KOUP8AGYdr8", "13": "QmP-K0zVoR0", "14": "FDoY1zaWB4I", "15": "gI40pUTzGPI", "16": "gs3lqEJHSnA", "17": "oav0TXI6bqc", "18": "8HATkU_F0iE", "19": "1YwDVqaszdU", "20": "gu8nQFHHD9w",
            "21": "fpnp3jRxRTs", "22": "wluh0U2wZuY", "23": "UUwZw_y6kpQ", "24": "PRQP-UPy6cQ", "25": "uVIXVFZOxKQ", "26": "5qSmQuBma3c", "27": "mHq89x2z2Lc", "28": "bVTyUTDSF9A", "29": "nVQqDcKAmzg", "30": "KRUHJDB75IE"
        },
        "5": { 
            "1": "_LDFLwqXJXs", "2": "W7ojCVtiTUc", "3": "j5betOWzPpA", "4": "p60LYcUJUXU", "5": "Famz84APAXY", "6": "yjuwsaz7x4o", "7": "3lLlhECn6H8", "8": "xXvSiWCCvhQ", "9": "Mv8EPmY3HNE", "10": "VjZXR9MM_P8",
            "11": "5UqZqXhaRQw", "12": "1nxS-KYiDmk", "13": "OEuYHlSMXMM", "14": "bpsoMEaNoVE", "15": "CHKP0oghspg", "16": "JqmI70XeC04", "17": "gCQXXS8exng", "18": "yyjAYG89-N0", "19": "VrsdG8wJGAg", "20": "D4dSs-iU1ac",
            "21": "UijLfadxH44", "22": "d5mjgRpyOTQ", "23": "9YbXxSUkweo"
        },
        "6": { 
            "1": "lgygCENldD0", "2": "bnzOL9v5Pn0", "3": "DKq0IjNhyKU", "4": "s-_GwW1bNoY", "5": "r3SMDnxT3aE", "6": "dTBnk-Vgfvg", "7": "tVX0gCVjN7s", "8": "mS6sWXH1aQw", "9": "lUuKvJlTaA8", "10": "O4iixZEv_HA"
        }
    },
    "tt3822326": { // Inanimate Insanity
        "1": { // 18 episodes
            "1": "lcGtU2eYeyU", "2": "iHQWL7CV4Sk", "3": "8RmAALsq48k", "4": "8k7V0Z9DQbs", "5": "IrG-bBk2WGc", "6": "Sz9wBEjMCT0", "7": "dZ9N0UGHheM", "8": "e9fBRfm9Z0w", "9": "1qjl2sKUIpM", "10": "H_KyjJaEz3s",
            "11": "hyk84Txx2gU", "12": "x1OL_VQr874", "13": "vVVbF1Hzx3k", "14": "_XCB0m0RzUc", "15": "U0Tz8-C5xyE", "16": "IHi-li1Vr-g", "17": "vFHoGWZPa3U", "18": "vEOd2TNtO3A"
        },
        "2": { // 18 episodes
            "1": "xEOUmwUB_cE", "2": "0tbpQ3jccbk", "3": "nrzRpAZibVc", "4": "l1-EsJtvm5w", "5": "5loEcrE1IvQ", "6": "dZft9ZHXWcE", "7": "scwqoN66DU0", "8": "omKX_3r4lxQ", "9": "ISpb8XU_0mU", "10": "Q4QADdy6rK4",
            "11": "IDlULbpnKA0", "12": "0vh5szkAdkY", "13": "ayHy91TVX1c", "14": "-Nom7K4Rqi0", "15": "hK4Va5Tgrjs", "16": "WKvS5_h3dQs", "17": "7etjFwAeKcA", "18": "xSeVhTmLHHM"
        },
        "3": { // 19 episodes
            "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "",
            "11": "", "12": "", "13": "", "14": "", "15": "", "16": "", "17": "", "18": "", "19": ""
        },
        "4": { // 5 episodes
            "1": "", "2": "", "3": "", "4": "", "5": ""
        }
    },
    "tt32626768": { // It's Time For The (ITFT)
        "1": {
            "1": "kvHc3e87Bfw", "2": "ZkZt5cmF3V4", "3": "PXC9iKRvbbQ", "4": "wAL4B7EGjX8", "5": "EtecN-s2qCg", "6": "Vco-wRzDoH4", "7": "qw0Rt9R_4ak", "8": "eFEyscrf_TY", "9": "n9fqveIS7UY", "10": "HYxdkCKeAIk"
        }
    },
    "tt32575983": { // Animatic Battle
        "1": {
            "1": "CjbUT7C5VY8", "2": "S5m9vxMLaVs", "3": "cc9vaq2QXkM", "4": "QdbBWz3YA_8"
        }
    },
    "tt19385824": { // ONE/HFJONE
        "1": {
            "1": "cE2hd1mKDZM", "2": "gNMzzvNbhZo", "3": "KJC7BiuwSp0", "4": "riXSyHcyq6k", "5": "h_dxq61_G9c", "6": "jtD-Y_lmOqw", "7": "BjGTlxIiXjs", "8": "yM0is0NKYf8", "9": "TyL7np2vXhs"
        },
        "2": {
            "1": "OWHZ2zOgr9c", "2": "0jq6sMEimPY", "3": "ZqwpZ09mbmo", "4": "raX54aw-bgc", "5": "wrkbSEBm5Fk", "6": "GhqmJ-NdPEE", "7": "deMihzUA4hY", "8": "Ew6Ho9sStZ0", "9": "8vRcG-ojfYc"
        }
    },
    "tt32641101": { // CFMOT/ИНМТ
        "1": {
            "1": "8Wnb4v61MBk", "2": "B1HsRADBsDE", "3": "tbmJvb9ARdc", "4": "NM7eF5x-1K4", "5": "c2-L3eVn5hk", "6": "yeDBnoFIIPk", "7": "Q1m75p4JH_k", "8": "Srua4phEAsE"
        }
    },
    "tt23672398": { // The Nightly Manor
        "1": {
            "1": "T1w9gjxShbo", "2": "N8njUkit0eE", "3": "jblwlgIcQes"
        },
        "2": {
            "1": "fTar7dVLofw", "2": "03dIz0y1DAc", "3": "A43PUiqnyEY"
        }
    }
};

builder.defineStreamHandler(({ type, id }) => {
    if (type === "series") {
        const parts = id.split(":"); 
        const imdbId = parts[0];
        const season = parts[1];   
        const episode = parts[2];  

        // Check across the new nested database structure
        if (showLinks[imdbId] && showLinks[imdbId][season] && showLinks[imdbId][season][episode]) {
            const ytId = showLinks[imdbId][season][episode];
            
            if (ytId !== "") {
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
    }

    return Promise.resolve({ streams: [] });
});

serveHTTP(builder.getInterface(), {
    port: process.env.PORT || 7000
});
