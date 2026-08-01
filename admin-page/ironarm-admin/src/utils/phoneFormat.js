const UZ_PREFIX = "+998";

/** Strip to up to 9 national digits (without country code). */
export function extractUzPhoneDigits(value) {
    let digits = String(value ?? "").replace(/\D/g, "");

    if (digits.startsWith("998")) {
        digits = digits.slice(3);
    }

    return digits.slice(0, 9);
}

/** Display: +998 XX XXX XX XX */
export function formatUzPhone(value) {
    const d = extractUzPhoneDigits(value);

    if (!d.length) {
        return `${UZ_PREFIX} `;
    }

    let formatted = UZ_PREFIX;

    if (d.length > 0) {
        formatted += ` ${d.slice(0, 2)}`;
    }
    if (d.length > 2) {
        formatted += ` ${d.slice(2, 5)}`;
    }
    if (d.length > 5) {
        formatted += ` ${d.slice(5, 7)}`;
    }
    if (d.length > 7) {
        formatted += ` ${d.slice(7, 9)}`;
    }

    return formatted;
}

/** True when all 9 national digits are present. */
export function isCompleteUzPhone(value) {
    return extractUzPhoneDigits(value).length === 9;
}

/** Stored / API value (formatted). Empty if incomplete. */
export function phoneForSubmit(value) {
    if (!isCompleteUzPhone(value)) {
        return null;
    }

    return formatUzPhone(value);
}
