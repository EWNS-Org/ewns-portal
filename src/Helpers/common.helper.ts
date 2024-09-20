import toast from "react-hot-toast";
import { categories } from "../utils/constants/categories";

export const validateFields = (fieldsToValidate: string[], showToast: boolean, formData: any) => {
    const validations: { [key: string]: () => boolean } = {
        businessName: () => {
            if (!formData.businessName.trim()) {
                showToast && toast.error("Business Name is required.");
                return false;
            }
            return true;
        },
        category: () => {
            if (!categories.includes(formData.category)) {
                showToast && toast.error("Invalid business category.");
                return false;
            }
            return true;
        },
        shortBio: () => {
            if (!formData.shortBio.trim()) {
                showToast && toast.error("Business Description is required.");
                return false;
            }
            return true;
        },
        name: () => {
            if (!formData.name.trim()) {
                showToast && toast.error("Full Name is required.");
                return false;
            }
            return true;
        },
        email: () => {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(formData.email)) {
                showToast && toast.error("Invalid email format.");
                return false;
            }
            return true;
        },
        password: () => {
            if (formData.password.length < 6) {
                showToast && toast.error("Password must be at least 6 characters.");
                return false;
            }
            return true;
        },
        confirmPassword: () => {
            if (formData.password !== formData.confirmPassword) {
                showToast && toast.error("Passwords do not match.");
                return false;
            }
            return true;
        },
        address: () => {
            if (!formData.address.trim()) {
                showToast && toast.error("Address is required.");
                return false;
            }
            return true;
        },
        pincode: () => {
            if (!/^\d{6}$/.test(formData.pincode)) {
                showToast && toast.error("Invalid pincode format.");
                return false;
            }
            return true;
        }
    };

    for (const key of fieldsToValidate) {
        if (validations[key] && !validations[key]()) {
            return false;
        }
    }

    return true;
};

export const validateTimings = (workingHours: any) => {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/; // Regex pattern for HH:mm format

    for (const day in workingHours) {
        const { open, close, isClosed } = workingHours[day];

        if (isClosed) {
            // If the business is closed on this day, skip validation for open and close timesa
            continue;
        }

        if (!timePattern.test(open) || !timePattern.test(close)) {
            return { valid: false, message: `${day}: Open and Close times must be in HH:mm format.` };
        }

        const [openHours, openMinutes] = open.split(':').map(Number);
        const [closeHours, closeMinutes] = close.split(':').map(Number);

        const openTime = openHours * 60 + openMinutes;
        const closeTime = closeHours * 60 + closeMinutes;

        if (openTime >= closeTime) {
            return { valid: false, message: `${day}: Open time must be less than close time.` };
        }
    }

    return { valid: true, message: 'Working hours are valid.' };
}