import toast from "react-hot-toast";
import { categories } from "../utils/constants/categories";

export const validateFields = (fieldsToValidate: string[], showToast: boolean, formData: any) => {
    const validations: { [key: string]: () => boolean } = {
        businessName: () => {
            if (!formData.businessName || formData.businessName.trim() === "") {
                showToast && toast.error("Business Name is required.");
                return false;
            }
            return true;
        },
        category: () => {
            if (!formData.category || !categories.includes(formData.category)) {
                showToast && toast.error("Invalid business category.");
                return false;
            }
            return true;
        },
        landmark: () => {
            if (!formData.landmark || formData.landmark.trim() === "") {
                showToast && toast.error("Landmark is required.");
                return false;
            }
            return true;
        }, 
        businessType: () => {
            if (!formData.businessType || !["SERVICE", "PRODUCT", "BOTH"].includes(formData.businessType)) {
                showToast && toast.error("Invalid business Type.");
                return false;
            }
            return true;
        },
        shortBio: () => {
            if (!formData.shortBio || formData.shortBio.trim() === "") {
                showToast && toast.error("Business Description is required.");
                return false;
            }
            return true;
        },
        name: () => {
            if (!formData.name || formData.name.trim() === "") {
                showToast && toast.error("Full Name is required.");
                return false;
            }
            return true;
        },
        email: () => {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email || formData.email.trim() === "" || !emailPattern.test(formData.email)) {
                showToast && toast.error("Invalid email format.");
                return false;
            }
            return true;
        },
        password: () => {
            if (!formData.password || formData.password.length < 6) {
                showToast && toast.error("Password must be at least 6 characters.");
                return false;
            }
            return true;
        },
        confirmPassword: () => {
            if (!formData.confirmPassword || formData.password !== formData.confirmPassword) {
                showToast && toast.error("Passwords do not match.");
                return false;
            }
            return true;
        },
        addressLine1: () => {
            if (!formData.addressLine1 || formData.addressLine1.trim() === "") {
                showToast && toast.error("Address 1 is required.");
                return false;
            }
            return true;
        },
        addressLine2: () => {
            if (!formData.addressLine2 || formData.addressLine2.trim() === "") {
                showToast && toast.error("Address 2 is required.");
                return false;
            }
            return true;
        },
        pincode: () => {
            if (!formData.pincode || formData.pincode.trim() === "" || !/^\d{6}$/.test(formData.pincode)) {
                showToast && toast.error("Invalid pincode format.");
                return false;
            }
            return true;
        },
        city: () => {
            if (!formData.city || formData.city.trim() === "") {
                showToast && toast.error("City is required.");
                return false;
            }
            return true;
        },
        state: () => {
            if (!formData.state || formData.state.trim() === "") {
                showToast && toast.error("State is required.");
                return false;
            }
            return true;
        },
        country: () => {
            if (!formData.country || formData.country.trim() === "") {
                showToast && toast.error("Country is required.");
                return false;
            }
            return true;
        },
        coords: () => {
            if (!formData.coords || !formData.coords.lat || formData.coords.lat === "" || !formData.coords.lng || formData.coords.lng === "") {
                showToast && toast.error("Latitude and Longitude are required.");
                return false;
            }
            if (isNaN(parseFloat(formData.coords.lat)) || isNaN(parseFloat(formData.coords.lng))) {
                showToast && toast.error("Invalid coordinates format.");
                return false;
            }
            return true;
        },
        phoneNumber: () => {
            if (!formData.phoneNumber || formData.phoneNumber.trim() === "" || !/^\d{10}$/.test(formData.phoneNumber)) {
                showToast && toast.error("Invalid phone number format. Must be 10 digits.");
                return false;
            }
            return true;
        },
        mobileNumber: () => {
            if (!formData.mobileNumber || formData.mobileNumber.trim() === "" || !/^\d{10}$/.test(formData.mobileNumber)) {
                showToast && toast.error("Invalid mobile number format. Must be 10 digits.");
                return false;
            }
            return true;
        },
        countryCode: () => {
            if (!formData.countryCode || formData.countryCode.trim() === "" || !/^\+\d{1,3}$/.test(formData.countryCode)) {
                showToast && toast.error("Invalid country code format.");
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
    console.log(workingHours)
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

export const getDefaultAppointmentConfigTimings = () => {
    let timings: any = {};
    ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].map(x => {
        timings[x] = {
            open: "09:00",
            close: "22:00",
            isClosed: false
        }
    });
    timings["sunday"] = {
        isClosed: true,
        close: "",
        open: ""
    }

    return timings;
}


export const getSubCategoryById = async (subCatId: any, categories: any, parentId: any) => {
  
    const findSubcategory = (subCategories: any) => {
      for (let i = 0; i < subCategories?.length; i++) {
        const subcategory = subCategories[i];
        if (subcategory._id.toString() === subCatId) {
          return subCategories[i];
        }
        
        // Check nested subCategories recursively
        if (subcategory.subCategories && subcategory.subCategories.length > 0) {
          const found : any= findSubcategory(subcategory.subCategories);
          if (found) {
            return found; // Subcategory found and removed in nested levels
          }
        }
      }
      return false; // Subcategory not found
    };

    let catData = null;
    for(let i of categories){
        if(i._id === parentId){
            catData = i;
            break;
        }
        if(parentId === subCatId && i._id === parentId) {
            catData = i;
            break;
        }
    }
    console.log(parentId, subCatId,"cat");

    if(parentId === subCatId && catData._id === parentId) return catData;
    else{
        const removed = findSubcategory(catData.subCategories);
        if (removed) {
            return removed;
          } else {
            return null;
          }
    }
  };