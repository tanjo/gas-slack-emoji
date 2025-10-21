# gas-slack-emoji

Slackワークスペースの絵文字の変更（追加・削除・更新）を監視し、Slackチャンネルに通知するGoogle Apps Scriptアプリケーションです。

## 概要

このアプリケーションは以下の機能を提供します：

- Slackワークスペースの絵文字一覧を定期取得
- Googleスプレッドシートに絵文字情報を保存
- 絵文字の追加・削除・更新を検知
- 変更があった場合にSlackチャンネルに自動通知

## 機能

### 絵文字監視
- **新規絵文字の検出**: 新しく追加された絵文字を検出し通知
- **削除された絵文字の検出**: 削除された絵文字を検出し通知  
- **更新された絵文字の検出**: 内容が変更された絵文字を検出し通知

### 通知機能
- Slackチャンネル（`#misc-emoji`）への自動通知
- 絵文字マニアという名前での投稿
- `:sleuth_or_spy:` アイコンでの投稿

## セットアップ

### 1. 必要な環境
- Google Apps Script
- Slack ワークスペースの管理者権限
- Google スプレッドシート

### 2. Slackアプリの設定
1. Slack APIでアプリを作成
2. 必要なスコープを設定:
   - `emoji:read` - 絵文字一覧の取得
   - `chat:write` - メッセージの投稿
3. Bot User OAuth Tokenを取得

### 3. Google Apps Scriptの設定
1. 新しいGoogle Apps Scriptプロジェクトを作成
2. `src/` フォルダ内のすべてのJSファイルをコピー
3. スクリプトプロパティを設定:
   - `SLACK_AUTH_TOKEN`: SlackのBot User OAuth Token
   - `SPREADSHEET_ID`: 絵文字データを保存するスプレッドシートのID
   - `SLACK_EMOJI_CHANNEL`: 通知先チャンネル（オプション）

### 4. スプレッドシートの準備
以下のシートを作成:
- `更新情報`: 最終更新日時などの管理情報用
- `操作禁止`: 絵文字データの保存用（A列：絵文字名、B列：絵文字URL）

## 使用方法

### 手動実行
```javascript
// 絵文字の比較と通知
EmojiController.compareEmoji();

// 絵文字一覧の保存
EmojiController.saveEmojiList();

// 両方を実行
run_compareEmoji();
```

### 定期実行の設定
Google Apps Scriptのトリガー機能を使用して定期実行を設定:
1. エディタで「トリガー」を選択
2. `run_compareEmoji` 関数を指定
3. 実行間隔を設定（推奨：1時間または1日）

## ファイル構成

```
src/
├── emoji_controller.js      # メインの絵文字制御ロジック
├── slack_controller.js      # Slack API操作
├── sheet_controller.js      # スプレッドシート操作  
└── notification_controller.js # 通知メッセージ生成
```

### 各ファイルの役割

#### `emoji_controller.js`
- ローカル（スプレッドシート）とリモート（Slack）の絵文字比較
- 差分検出と通知のメイン処理

#### `slack_controller.js`
- Slack API との通信
- 絵文字一覧取得
- チャンネルへのメッセージ投稿

#### `sheet_controller.js`
- Googleスプレッドシートの読み書き
- 絵文字データの保存・取得

#### `notification_controller.js`
- 通知メッセージの生成
- 新規・削除・更新それぞれの通知形式

## カスタマイズ

### 通知チャンネルの変更
`slack_controller.js` の `SLACK_CHANNEL` を編集:
```javascript
static get SLACK_CHANNEL() {
  return `#your-channel`;
}
```

### 通知メッセージのカスタマイズ
`notification_controller.js` の各メソッドでメッセージ内容を変更可能

### Bot名とアイコンの変更
`slack_controller.js` で設定:
```javascript
static get USER_NAME() {
  return `カスタムBot名`;
}

static get ICON_EMOJI() {
  return `:custom_icon:`;
}
```

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。
