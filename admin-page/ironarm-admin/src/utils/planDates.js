/** Add calendar months (e.g. 3 Mar + 3 months → 3 Jun). */
export function addCalendarMonths(startDate, months) {
    const date = new Date(startDate.getTime());
    date.setMonth(date.getMonth() + months);
    return date;
}

export function formatPlanDate(date) {
    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function computePlanEndDate(startDate, durationMonths) {
    if (!startDate || durationMonths == null) {
        return null;
    }

    return addCalendarMonths(startDate, durationMonths);
}
