class EmojiController {

  static getLocalEmojiKeyList() {
    const sheetController = new SheetController();
    return new Set(sheetController.getEmojiKeyList());
  }

  static getLocalEmojiValueList() {
    const sheetController = new SheetController();
    return new Set(sheetController.getEmojiValueList());
  }

  static getLocalEmojiList() {
    const sheetController = new SheetController();
    return sheetController.getEmojiList();
  }

  static getRemoteEmojiList() {
    const slackController = new SlackController();
    return slackController.emojiList();
  }

  static compareEmoji() {
    const notificationController = new NotificationController();

    const localEmojiKeySet = EmojiController.getLocalEmojiKeyList();
    const slackEmoji = EmojiController.getRemoteEmojiList();
    const slackEmojiKeySet = new Set(Object.keys(slackEmoji));

    const newEmojis = slackEmojiKeySet.difference(localEmojiKeySet);
    notificationController.notifyNewEmoji(Array.from(newEmojis));

    const deletedEmojis = localEmojiKeySet.difference(slackEmojiKeySet);
    notificationController.notifyDeletedEmoji(Array.from(deletedEmojis));

    const localEmojiValueSet = EmojiController.getLocalEmojiValueList();
    const slackEmojiValueSet = new Set(Object.values(slackEmoji));

    const changeEmojiValues = localEmojiValueSet.difference(slackEmojiValueSet);
    const localEmojiList = EmojiController.getLocalEmojiList();
    const changedEmojis = Array.from(changeEmojiValues).map(value => {
      for (const emoji of localEmojiList) {
        if (emoji.content === value) {
          return emoji.key;
        }
      }
      return null;
    }).filter(Boolean);
    notificationController.notifyChangedEmoji(changedEmojis);

    const sheetController = new SheetController();
    sheetController.updateLastCheckedAt();
  }

  static saveEmojiList() {
    const slackEmoji = EmojiController.getRemoteEmojiList();
    // データをシートに反映
    const sheetController = new SheetController();
    sheetController.setEmojiListRange(Object.entries(slackEmoji).map(([key, content]) => ({ key, content })));
    sheetController.updateLastRetrievedAt();
  }
};

function run_compareEmoji() {
  EmojiController.compareEmoji();
  EmojiController.saveEmojiList();
}