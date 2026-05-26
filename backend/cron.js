const cron = require("node-cron");

const {
  getExpiredBookingsModel,
  updateFilterStatusModel,
} = require("./models/createProjectFilterModel");

const { updateApartmentStatusModel } = require("./models/projectModel");

cron.schedule("* * * * *", async () => {
  try {
    console.log("Checking expired filters...");

    const expiredBookings = await getExpiredBookingsModel();

    for (const booking of expiredBookings) {
      console.log(`Expiring Filter ID: ${booking.filter_id}`);

      await updateFilterStatusModel(booking.filter_id, "EXPIRED");

      await updateApartmentStatusModel(booking.apartment_id, "Y");
    }

    console.log("Expired filters updated");
  } catch (error) {
    console.error("Cron Error:", error);
  }
});
