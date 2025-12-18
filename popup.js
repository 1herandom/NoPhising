import main_api_detection from "./scripts/api_based_detection.js";
import main_url_cheak from "./scripts/urlcheaking.js";

const api = typeof browser !== "undefined" ? browser : chrome;

async function get_url() {
    try {
        let [tab] = await api.tabs.query({ active: true, currentWindow: true });
        return tab?.url || null;
    } catch (e) {
        return null;
    }
}

function risk_assement_display(score) {
    if (score >= 0 && score <= 2) {
        return { level: "SAFE", color: "#27ae60", message: "This website appears established and safe." };
    } 
    else if (score >= 3 && score <= 6) {
        return { level: "CAUTION", color: "#f1c40f", message: "Warning: Some flags were found. Proceed with caution." };
    } 
    else {
        return { level: "DANGER", color: "#e74c3c", message: "High Risk: This website shows strong signs of phishing!" };
    }
}

const runMain = async () => {
    try {
        const url = await get_url();
        if (!url) throw new Error("Could not access page URL");
        
        document.getElementById('url-text').textContent = url;
        
        const api_threat = await main_api_detection(url);
        const url_threat = await main_url_cheak(url);
        
        const total_score = (api_threat * 2) + url_threat; 
        const result = risk_assement_display(total_score);

        const card = document.getElementById('status-card');
        const title = document.getElementById('risk-title');
        const desc = document.getElementById('risk-desc');
        const meter = document.getElementById('meter-fill');

        card.className = `card ${result.level.toLowerCase()}`;
        card.style.borderTopColor = result.color;
        
        title.textContent = result.level;
        title.style.color = result.color;
        desc.textContent = result.message;
        
        if (meter) {
            const widthValue = Math.min((total_score * 10), 100);
            meter.style.width = widthValue + "%";
            meter.style.backgroundColor = result.color;
        }

    } catch (error) {
        const title = document.getElementById('risk-title');
        const desc = document.getElementById('risk-desc');
        if (title) title.textContent = "Error";
        if (desc) desc.textContent = error.message;
    }
};

if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', runMain);
} else {
    runMain();
}