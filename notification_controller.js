class NotificationController {
  notifyNewEmoji(emojis) {
    if (emojis.length > 0) {
      var message = "新しい絵文字が見つかったよ！\n";
      for (var i = 0; i < emojis.length; i++) {
        message += ":" + emojis[i] + ":";
      }
      const slackController = new SlackController();
      slackController.chatPostMessage(message);
      // Logger.log(message);
    }
  }
  notifyChangedEmoji(emojis) {
    if (emojis.length > 0) {
      var message = "何やら絵文字が更新されたよ！\n";
      for (var i = 0; i < emojis.length; i++) {
        message += ":" + emojis[i] + ":";
      }
      const slackController = new SlackController();
      slackController.chatPostMessage(message);
      // Logger.log(message);
    }
  }
  notifyDeletedEmoji(emojis) {
    if (emojis.length > 0) {
      var message = "絵文字が削除されたよ！\n";
      for (var i = 0; i < emojis.length; i++) {
        message += ":" + emojis[i] + ":";
      }
      const slackController = new SlackController();
      slackController.chatPostMessage(message);
      // Logger.log(message);
    }
  }
}
