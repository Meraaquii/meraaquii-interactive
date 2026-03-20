import navbarService from "../services/navbarService";

const navbarController = {
  /**
   * Get display name from stored user
   * @returns {string}
   */
  getUserDisplayName: () => {
    const user = navbarService.getUser();
    return user?.user_name || "User";
  },

  /**
   * Get user type from stored user
   * @returns {string|null}
   */
  getUserType: () => {
    const user = navbarService.getUser();
    return user?.user_type || null;
  },

  /**
   * Handle logout: call API, clear session, redirect
   * @param {Function} onSuccess - called after logout
   * @param {Function} onError   - called if something goes wrong (optional)
   */
  handleLogout: async (onSuccess, onError) => {
    try {
      await navbarService.logoutApi();
    } catch {
      // Even if API fails, we still clear session — user must not stay trapped
    } finally {
      navbarService.clearSession();
      onSuccess();
    }
  },

  /**
   * Toggle browser fullscreen
   * @param {boolean} isFullscreen - current state
   * @param {Function} setIsFullscreen - state setter
   */
  handleFullscreen: (isFullscreen, setIsFullscreen) => {
    if (isFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  },
};

export default navbarController;
