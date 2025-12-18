export default async (url) => {
    const domain_name = get_domain_name(url);
    if (!domain_name) return 2;

    const domain_info = await domain_when_created(domain_name);
    if (!domain_info) return 2;

    const date_of_registration = check_for_registration(domain_info);
    if (!date_of_registration) return 2;

    return days_since_registration_of_domain(date_of_registration);
};

const get_domain_name = (url) => {
    try {
        const url_object = new URL(url);
        let domain_name = url_object.hostname;
        return domain_name.replace(/^www\./i, "");
    } catch (error) {
        return null;
    }
};

async function domain_when_created(domain_name) {
    try {
        const response = await fetch("https://rdap.org/domain/" + domain_name);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
}

const check_for_registration = (domain_info) => {
    if (!domain_info || !domain_info.events) return null;
    for (let i = 0; i < domain_info.events.length; i++) {
        if (domain_info.events[i].eventAction === "registration") {
            return domain_info.events[i].eventDate.split("T")[0];
        }
    }
    return null;
};

const days_since_registration_of_domain = (date_of_registration) => {
    if (!date_of_registration) return 2;
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const block_of_date = formattedDate.split("-");
    const block_of_domain_date = date_of_registration.split("-");

    if (block_of_date[0] - block_of_domain_date[0] > 2) {
        return 0;
    } else if (block_of_date[1] - block_of_domain_date[1] > 3) {
        return 1;
    } else {
        return 2;
    }
};