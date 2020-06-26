module.exports = {
  canModifyQueue(member) {
    const { channel } = member.voice;
    const botChannel = member.guild.me.voice.channel;

    if (channel !== botChannel) {
      member.send("📛 ***➽***  **คุณต้องเข้าห้องพูดคุยก่อน**").catch(console.error);
      return false;
    }

    return true;
  }
};
