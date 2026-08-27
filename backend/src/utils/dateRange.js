/**
 * Build a Mongo date query from UI filter params.
 * All time: no filter → null
 * today | weekly | monthly | yearly | custom (+ startDate/endDate)
 */
export const getDateRange = (filter, startDate, endDate) => {
    const now = new Date();

    switch (filter) {
        case "today": {
            const start = new Date(now);
            start.setHours(0, 0, 0, 0);
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            return { $gte: start, $lte: end };
        }
        case "weekly": {
            const start = new Date(now);
            const day = start.getDay();
            const diff = day === 0 ? -6 : 1 - day; // Monday as week start
            start.setDate(start.getDate() + diff);
            start.setHours(0, 0, 0, 0);
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            return { $gte: start, $lte: end };
        }
        case "monthly": {
            const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            return { $gte: start, $lte: end };
        }
        case "yearly": {
            const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            return { $gte: start, $lte: end };
        }
        case "custom": {
            if (!startDate || !endDate) return null;
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
            return { $gte: start, $lte: end };
        }
        default:
            return null; // no filter → all-time
    }
};
