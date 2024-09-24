export const registerNewCompany = async (
  company: string,
  passwordOwner: string,
  passwordAdmin: string,
  phone: string
) => {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company,
        passwordOwner,
        passwordAdmin,
        phone,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true, message: result.message };
    } else {
      return {
        success: false,
        message: "Failed to register company:" + result.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to register company:" + error,
    };
  }
};

export const checkCompanyName = async (name: string) => {
  try {
    const response = await fetch(`/api/isExist/business?name=${name}`, {
      method: "GET",
    });

    const result = await response.json();

    if (result.success) {
      return { success: true, exists: result.exists };
    } else {
      return { success: false, message: "Failed to check company name." };
    }
  } catch (error) {
    return { success: false, message: "Error checking company name: " + error };
  }
};
