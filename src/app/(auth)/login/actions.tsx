export const login = async (email: string, password: string) => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (result.success) {
      return {
        success: true,
        message: result.message,
        idToken: result.idToken,
      };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    return { success: false, message: "Login failed: " + error };
  }
};

export const logout = async () => {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      console.log(result.message);
    } else {
      console.error("Logout failed:", result.message);
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
