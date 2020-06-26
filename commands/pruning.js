const fs = require("fs");
const config = require("../config.json");

module.exports = {
  name: "pruning",
  description: "🛎 เปิด : ปิด ลบข้อความบอท",
  execute(message) {
    config.PRUNING = !config.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send("🚫 ***➽***  **ไม่สามารถลบข้อความได้**").catch(console.error);
      }

      return message.channel
        .send(`🚫 ***➽***  บอทลบข้อความ ***➽*** ${config.PRUNING ? "**เปิดการใช้งาน**" : "**ปิดการใช้งาน**"}`)
        .catch(console.error);
    });
  }
};
