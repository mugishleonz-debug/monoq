# MonoQ コーポレートサイト

MonoQのコーポレートサイトです。
Astroで静的HTMLを書き出し、Xserver上ではフォーム送信のみPHPで処理します。

## 構成

```txt
astro/
├─ src/
│  ├─ lib/microcms.ts          # microCMS news API クライアント
│  └─ pages/
│     ├─ index.astro           # トップページ
│     └─ news/
│        ├─ index.astro        # お知らせ一覧
│        └─ [slug].astro       # お知らせ詳細
├─ public/
│  ├─ uploads/                 # 画像などの静的アセット
│  └─ contact.php              # Xserver用フォーム送信PHP
├─ dist/                       # ビルド後の公開ファイル
├─ .env.example                # 環境変数サンプル
└─ package.json
```

## 開発コマンド

```bash
npm install
npm run dev
npm run build
npm run preview
```

この作業環境ではGoogle Drive配下の `node_modules` が壊れやすかったため、依存関係を入れ直す場合は一度 `node_modules` を削除してから `npm install` してください。

## microCMS設定

お知らせはmicroCMSの `news` APIから取得します。
環境変数は `.env` に設定します。

```env
PUBLIC_MICROCMS_SERVICE_DOMAIN=monoq
MICROCMS_API_KEY=本番用GETキー
```

`MICROCMS_API_KEY` が未設定の場合は、`src/lib/microcms.ts` 内のフォールバックデータで表示されます。

### news API スキーマ

- API名: お知らせ
- API ID: `news`
- APIの型: リスト形式
- コンテンツID: 手動指定

| フィールド | ID | 種類 | 必須 |
| --- | --- | --- | --- |
| タイトル | `title` | テキスト | 必須 |
| カテゴリ | `category` | セレクト | 必須 |
| タグ | `tag` | テキスト | 必須 |
| アイキャッチ画像 | `eyecatch` | 画像 | 必須 |
| 抜粋 | `excerpt` | テキストエリア | 必須 |
| 本文 | `body` | リッチエディタv2 | 必須 |
| SEO description | `seoDescription` | テキストエリア | 任意 |
| OGP画像 | `seoOgImage` | 画像 | 任意 |

カテゴリの選択肢:

```txt
Release
Report
Media
Insight
Company
```

## フォーム送信

フォームは `public/contact.php` にPOSTします。
Astroビルド後は `dist/contact.php` にコピーされます。

フォーム送信先メールアドレスは `public/contact.php` の以下を本番用に変更してください。

```php
$adminEmail = 'info@monoq.jp';
$fromEmail = 'no-reply@monoq.jp';
$fromName = 'MonoQ Web';
```

PHP側で行っている処理:

- POSTメソッド制限
- 必須項目チェック
- メールアドレス形式チェック
- プライバシーポリシー同意チェック
- honeypotによる簡易スパム対策
- 管理者宛メール送信
- ユーザー宛自動返信メール送信
- JSONレスポンス返却

Xserverでは、`$fromEmail` にドメインと同じメールアドレスを使うと送信成功率が安定します。

## Xserverへの公開手順

1. ローカルでビルドします。

```bash
npm run build
```

2. `dist/` の中身をXserverの公開ディレクトリへアップロードします。

例:

```txt
public_html/
├─ index.html
├─ contact.php
├─ news/
├─ _astro/
└─ uploads/
```

3. Xserver上で `contact.php` の送信先メールアドレスを確認します。

4. フォームからテスト送信し、管理者宛メールと自動返信メールが届くか確認します。

## 注意点

- 現在トップページには `noindex` が入っています。公開して検索流入を狙う場合は削除してください。
- `contact.php` は静的ホスティングでは動作しません。XserverなどPHPが動くサーバーに配置してください。
- microCMSのAPIキーは公開リポジトリに含めないでください。
