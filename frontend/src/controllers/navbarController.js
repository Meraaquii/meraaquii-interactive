import navbarService from "../services/navbarService";

const navbarController = {
  getUserDisplayName: () => {
    const user = navbarService.getUser();
    return user?.user_name || "User";
  },

  getUserType: () => {
    const user = navbarService.getUser();
    return user?.user_type || null;
  },

  handleLogout: async (onSuccess, onError) => {
    try {
      await navbarService.logoutApi();
    } catch {
    } finally {
      navbarService.clearSession();
      onSuccess();
    }
  },

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
