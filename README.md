# Tech News bot テンプレ

Qiita の人気記事を3件取ってきて、Discord に投稿するプログラム

## 準備

- Node.js 22.18 以上（`node -v` で確認）
- Git


## 実行手順

```sh
npm run preview          # 投稿せずに、画面に表示
```

Discord に投稿するときは、`.env.example` をコピーして `.env` を作り、Webhook の URL と名前を書いてから:

```sh
npm run post             # Discord に投稿
```



## GitHub Actions を使用する場合

1. Settings → Secrets and variables → Actions → New repository secret で、名前 `DISCORD_WEBHOOK_URL`、値に Webhook の URL を登録
2. Actions タブ → `post` → Run workflow
