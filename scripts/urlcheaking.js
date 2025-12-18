export default async (url) => {
    const no_of_ascii_char = individual_ascii_cheak(url);
    const no_of_common_prefix = check_for_common_prefix(url);
    const checking_punycode = punycode_check(url);
    const url_security = check_url_security(url);
    
    return (no_of_ascii_char || 0) + 
           (no_of_common_prefix || 0) + 
           (checking_punycode || 0) + 
           (url_security || 0); 
};

const individual_ascii_cheak = (url) => {
    const char_of_url = url.split(""); 
    for (let i = 0; i < char_of_url.length; i++) {
        const code = char_of_url[i].charCodeAt(0);
        if (code > 127) {
            return 1;
        }
    }
    return 0;
};

const check_url_security = (url) => {
    if (url.startsWith("https://")) {
        return 0;
    } else if (url.startsWith("http://")) {
        return 2;
    } else {
        return 4;
    }
};

const check_for_common_prefix = (url) => {
    const most_used_tld_for_phishing = [
        "tk", "ml", "ga", "cf", "gq", "top", "icu", "xyz", 
        "biz", "info", "site", "online", "live", "click", 
        "link", "support", "store", "shop", "review", "loan", "work"
    ];

    try {
        const url_object = new URL(url);         
        const domain_name = url_object.hostname;
        const block_of_domainName = domain_name.split(".");
        const tld = block_of_domainName[block_of_domainName.length - 1]; 
        
        return most_used_tld_for_phishing.includes(tld) ? 1 : 0;
    } catch (e) {
        return 0;
    }
};

const punycode_check = (url) => {
    const block_of_url = url.split(".");
    for (let i = 0; i < block_of_url.length; i++) {
        if (block_of_url[i].toLowerCase().startsWith("xn--")) {
            return 1;
        }
    }
    return 0;
};