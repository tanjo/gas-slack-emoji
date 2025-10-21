class SlackController {

  // Slack 認証トークン
  // デフォルトは script properties の SLACK_AUTH_TOKEN
  static get SLACK_AUTH_TOKEN() {
    return PropertiesService.getScriptProperties().getProperty('SLACK_AUTH_TOKEN');
  }

  // Slack 絵文字投稿チャンネル
  static get SLACK_CHANNEL() {
    return `#misc-emoji`;
  }

  static get USER_NAME() {
    return `絵文字マニア`;
  }

  static get PARSE_MODE() {
    return `full`;
  }

  static get ICON_EMOJI() {
    return `:sleuth_or_spy:`;
  }

  // Slack 絵文字投稿チャンネル
  // デフォルトは #misc-emoji
  static get EMOJI_CHANNEL() {
    return PropertiesService.getScriptProperties().getProperty('SLACK_EMOJI_CHANNEL');
  }

  // Slack 絵文字一覧取得の URL
  static get SLACK_URL_EMOJI_LIST() {
    return "https://slack.com/api/emoji.list";
  }

  // Slack メッセージ投稿の URL
  static get SLACK_URL_ROOMS_MESSAGE() {
    return "https://slack.com/api/chat.postMessage";
  }

  // Slack メッセージ削除の URL
  static get SLACK_URL_CHAT_DELETE() {
    return "https://slack.com/api/chat.delete";
  }

  // Slack メッセージ投稿のオプションを構築する
  buildSlackMessageOptions(message) {
    return {
      token: SlackController.SLACK_AUTH_TOKEN,
      channel: SlackController.SLACK_CHANNEL,
      text: message,
      username: SlackController.USER_NAME,
      parse: SlackController.PARSE_MODE,
      icon_emoji: SlackController.ICON_EMOJI
    };
  }

  // リクエストパラメータを構築する
  buildRequestParams(message) {
    return {
      method: "post",
      payload: this.buildSlackMessageOptions(message)
    };
  }

  // Slack の #misc-emoji に投稿する.
  // 名前は 「絵文字マニア」.アイコンは `:sleuth_or_spy:`.
  chatPostMessage(message) {
    const response = UrlFetchApp.fetch(
      SlackController.SLACK_URL_ROOMS_MESSAGE,
      this.buildRequestParams(message)
    );
    return response;
  }

  // 絵文字一覧を取得する
  // return: 連想配列の emoji を含むオブジェクト.
  emojiList() {
    const response = UrlFetchApp.fetch(
      SlackController.SLACK_URL_EMOJI_LIST +
        "?token=" +
        SlackController.SLACK_AUTH_TOKEN
    );
    const contents = JSON.parse(response.getContentText());
    return contents.emoji;
  }

  // メッセージ削除
  chatDelete(ts, channel = SlackController.EMOJI_CHANNEL) {
    const url = `${SlackController.SLACK_URL_CHAT_DELETE}?token=${SlackController.SLACK_AUTH_TOKEN}&channel=${channel}&ts=${ts}`;
    const response = UrlFetchApp.fetch(url);
    const contents = JSON.parse(response.getContentText());
    return contents;
  }
};

// https://api.slack.com/methods/channels.history/test で ts を確認して
function testDelete() {
  const slackController = new SlackController();
  slackController.chatDelete("1621597927.001700");
}