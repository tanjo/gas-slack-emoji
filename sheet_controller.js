class SheetController {

  static get SPREADSHEET_ID() {
    return PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  }

  static get UPDATE_INFO_SHEET_NAME() {
    return '更新情報';
  }

  static get EMOJI_LIST_SHEET_NAME() {
    return '操作禁止';
  }

  static get EMOJI_SHEET_KEY_COLUMN() {
    return 0;
  }

  static get EMOJI_SHEET_CONTENT_COLUMN() {
    return 1;
  }

  getSpreadsheet() {
    return SpreadsheetApp.openById(SheetController.SPREADSHEET_ID);
  }

  getSheetByName(sheetName) {
    const spreadSheet = this.getSpreadsheet();
    return spreadSheet.getSheetByName(sheetName);
  }

  getEmojiListSheet() {
    return this.getSheetByName(SheetController.EMOJI_LIST_SHEET_NAME);
  }

  getUpdateInfoSheet() {
    return this.getSheetByName(SheetController.UPDATE_INFO_SHEET_NAME);
  }

  getEmojiKeyList() {
    const sheet = this.getEmojiListSheet();
    const lastRow = sheet.getLastRow();
    const keys = sheet.getRange(1, SheetController.EMOJI_SHEET_KEY_COLUMN + 1, lastRow).getValues();
    // [['key1'], ['key2'], [], ['key3], ...]  =>  ['key1', 'key2', 'key3', ...]
    return keys.join().split(',').filter(Boolean);
  }

  getEmojiValueList() {
    const sheet = this.getEmojiListSheet();
    const lastRow = sheet.getLastRow();
    const contents = sheet.getRange(1, SheetController.EMOJI_SHEET_CONTENT_COLUMN + 1, lastRow).getValues();
    // [['content1'], ['content2'], [], ['content3], ...]  =>  ['content1', 'content2', 'content3', ...]
    return contents.join().split(',').filter(Boolean);
  }

  getEmojiList() {
    const sheet = this.getEmojiListSheet();
    const lastRow = sheet.getLastRow();
    let emojiList = [];
    if (lastRow > 0) {
      const keys = sheet.getRange(1, SheetController.EMOJI_SHEET_KEY_COLUMN + 1, lastRow).getValues();
      const contents = sheet.getRange(1, SheetController.EMOJI_SHEET_CONTENT_COLUMN + 1, lastRow).getValues();
      for (let i = 0; i < lastRow; i++) {
        const key = keys[i][0];
        const content = contents[i][0];
        emojiList.push({ key, content });
      }
    }
    return emojiList;
  }

  setEmojiList(emojiList) {
    const sheet = this.getEmojiListSheet();
    sheet.clear();
    for (let i = 0; i < emojiList.length; i++) {
      const emoji = emojiList[i];
      sheet.getRange(i + 1, SheetController.EMOJI_SHEET_KEY_COLUMN + 1).setValue(emoji.key);
      sheet.getRange(i + 1, SheetController.EMOJI_SHEET_CONTENT_COLUMN + 1).setValue(emoji.content);
    }
  }

  setEmojiListRange(emojiList) {
    const sheet = this.getEmojiListSheet();
    const lastRow = sheet.getLastRow();
    sheet.getRange(1, 1, lastRow, 2).clear();
    sheet.getRange(1, 1, emojiList.length, 2).setValues(
      emojiList.map(emoji => [emoji.key, emoji.content])
    );
  }

  updateLastCheckedAt() {
    const sheet = this.getUpdateInfoSheet();
    const now = new Date();
    sheet.getRange(1, 1).setValue(`最終確認日時: ${now.toLocaleString()}`);
  }

  updateLastRetrievedAt() {
    const sheet = this.getUpdateInfoSheet();
    const now = new Date();
    sheet.getRange(2, 1).setValue(`最終取得日時: ${now.toLocaleString()}`);
  }
};