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
