# monoc

モノク株式会社（MonoQ, Inc.）コーポレートサイト

エンジニアの実力を、正しく評価する。AIコーディングテストでスキルを客観的に可視化するIT人材評価SaaS「MonoQ」と、SES事業を展開する会社のLPです。

## 構成

```
monoc/
├── astro/                    ← 本番ソース（Astro 6 + React 19 + TypeScript strict）
│   ├── src/
│   │   ├── layouts/BaseLayout.astro
│   │   ├── components/       ← Hero/Vision/Business/Company/Message/News/Faq/Contact/Footer/Nav/Opening/TweaksPanel
│   │   ├── pages/index.astro
│   │   └── styles/global.css
│   ├── public/
│   │   ├── uploads/          ← 画像アセット
│   │   └── scripts/main.js   ← 既存LPから移植したインラインスクリプト群
│   └── package.json
├── MONOKU Landing.html       ← 元の静的HTML（移植元・参照用に保持）
├── tweaks-panel.jsx          ← 元のReactパネル（参照用・移植済み）
└── uploads/                  ← 元の画像アセット（参照用・astro/public/uploads/にコピー済み）
```

## 開発

```bash
cd astro
npm install      # 初回のみ
npm run dev      # http://localhost:4321/
```

## ビルド

```bash
cd astro
npm run build    # dist/ に静的ファイルが生成される
npm run preview  # 本番ビルドのローカル確認
```

## デプロイ

Xサーバーにデプロイ予定。`astro/dist/` を FTP でアップロード、または GitHub Actions 経由でMicroCMSのWebhookから自動デプロイ（Phase 6で構築予定）。

## 移植進捗

- [x] Phase 1: Astro初期化（@astrojs/react 統合済み）
- [x] Phase 2: 既存LPの完全移植（ビジュアル差分なし）
- [ ] Phase 3: MicroCMS連携（Newsセクションのデータ化）
- [ ] Phase 4: `/news/` 一覧と `/news/[slug]` 詳細ページ生成、SEO（OGP・JSON-LD・sitemap）
- [ ] Phase 5: View Transitions（モーダル風シームレス遷移）
- [ ] Phase 6: Xサーバーへのデプロイフロー整備

## 技術スタック

- Astro 6.3.7
- React 19（Tweaks Panel開発用Islandのみ）
- TypeScript strict
- anime.js（CDN、ヒーローセクションのアニメーション用）
- Google Fonts: Zen Kaku Gothic New / Noto Sans Mono / Noto Serif JP
- Material Symbols Outlined（アイコン）

## CMS（予定）

MicroCMSを採用予定。Newsエンドポイントのみ。FAQはハードコード運用（更新頻度が低いため）。
