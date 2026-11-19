// Qiita の人気記事を取ってきて、Discord に投稿するプログラム
//   ① 取得 → ② 選ぶ → ③ 整形 → ④ 投稿
//   npm run preview … ①〜③ を実行して、画面に表示するだけ
//   npm run post    … ①〜④ を実行して、Discord に投稿する
import { parseArgs } from 'node:util';

const FEED_URL = 'https://qiita.com/popular-items/feed'; // Qiita の人気記事フィード
const COUNT = 3; // 投稿する記事の数

type Article = { title: string; url: string };

// ① 取得：フィードを読み込んで、記事のタイトルと URL の一覧にする
async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`フィードの取得に失敗しました（HTTP ${res.status}）`);
  const xml = await res.text();
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  return entries.map((entry) => ({
    title: decode(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''),
    url: (entry.match(/<link[^>]*href="([^"]+)"/)?.[1] ?? '').split('?')[0]!,
  }));
}

// ② 選ぶ：上から count 件（フィードはもともと人気順に並んでいる）
function pickTop(articles: Article[], count: number): Article[] {
  return articles.slice(0, count);
}

// 練習用：キーワードを含む記事だけに絞り込む（まだ作っていない）
function filterByKeyword(articles: Article[], keyword: string): Article[] {
  throw new Error(`filterByKeyword はまだ作られていません（keyword: ${keyword}）`);
}

// ③ 整形：Discord に送る文章を組み立てる
function buildMessage(articles: Article[], name: string): string {
  const lines = articles.map((a, i) => `${i + 1}. ${a.title}\n   ${a.url}`);
  return [`📰 Qiita の人気記事（${name} さんの投稿）`, ...lines].join('\n');
}

// ④ 投稿：Discord の Webhook に送る
async function postToDiscord(webhookUrl: string, content: string): Promise<void> {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // allowed_mentions: @everyone などで全員に通知が飛ばないようにする
    body: JSON.stringify({ content, allowed_mentions: { parse: [] } }),
  });
  if (!res.ok) throw new Error(`Discord への投稿に失敗しました（HTTP ${res.status}）`);
}

// &amp; などの記号を元の文字に戻す
function decode(text: string): string {
  return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

// ここから実行される
const { values } = parseArgs({ options: { post: { type: 'boolean' }, keyword: { type: 'string' } } });

let articles = await fetchArticles();
if (values.keyword) articles = filterByKeyword(articles, values.keyword);
const message = buildMessage(pickTop(articles, COUNT), process.env.YOUR_NAME || 'ゲスト');
console.log(message);

if (values.post) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) throw new Error('DISCORD_WEBHOOK_URL が設定されていません（手元では .env、GitHub Actions では Secrets を確認してください）');
  await postToDiscord(webhookUrl, message);
  console.log('\n✅ Discord に投稿しました');
}
