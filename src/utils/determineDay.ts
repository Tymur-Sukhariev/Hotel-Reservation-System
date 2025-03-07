export function dateOnTimeZone(createdAt: string) {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; 

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        timeZone: userTimeZone
    }).format(new Date(createdAt));
}
