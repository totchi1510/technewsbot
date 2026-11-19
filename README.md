# Hello AI ハンズオン：人気記事を Discord に流そう

Qiita の人気記事を3件取ってきて、Discord に投稿する小さなプログラムです（`src/main.ts`）。
**① 取得 → ② 選ぶ → ③ 整形 → ④ 投稿** の順に動きます。

## 準備

- Node.js 22.18 以上（`node -v` で確認）
- Git
- AI コーディングツール（お好きなもの）

依存パッケージはありません。TypeScript を Node.js がそのまま実行するので、`npm install` やビルドは不要です。

## 動かす

```sh
npm run preview          # 投稿せずに、画面に表示する
```

Discord に投稿するときは、`.env.example` をコピーして `.env` を作り、Webhook の URL と名前を書いてから:

```sh
npm run post             # Discord に投稿する
```

`.env` は GitHub に上げないでください（`.gitignore` で除外済み）。

## GitHub Actions で動かす

1. Settings → Secrets and variables → Actions → New repository secret で、名前 `DISCORD_WEBHOOK_URL`、値に Webhook の URL を登録
2. Actions タブ → `post` → Run workflow
