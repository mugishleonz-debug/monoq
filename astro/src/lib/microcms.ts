export type NewsCategory = 'Release' | 'Report' | 'Media' | 'Insight' | 'Company';

export type MicroCmsImage = {
  url: string;
  height?: number;
  width?: number;
};

export type NewsItem = {
  id: string;
  title: string;
  category: NewsCategory;
  tag: string;
  eyecatch: MicroCmsImage;
  excerpt: string;
  body: string;
  seoDescription?: string;
  seoOgImage?: MicroCmsImage;
  publishedAt?: string;
  updatedAt?: string;
  revisedAt?: string;
};

type MicroCmsListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

const serviceDomain = import.meta.env.PUBLIC_MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;
const endpoint = 'news';

export const fallbackNews: NewsItem[] = [
  {
    id: 'monoq-skill-matrix-release',
    title: '新サービス「MonoQ Skill Matrix」を正式ローンチしました',
    category: 'Release',
    tag: 'プロダクト',
    eyecatch: { url: 'https://picsum.photos/seed/monoq-news-01/800/500' },
    excerpt: 'AIコーディングテストとスキルマトリクスを統合した新サービスの提供を開始しました。エンジニア評価における新たな標準として、技術力の可視化を実現します。',
    body: '<p>AIコーディングテストとスキルマトリクスを統合した新サービスの提供を開始しました。エンジニアの実力をより客観的に可視化し、採用・評価・育成の判断を支援します。</p>',
    publishedAt: '2026-05-20T00:00:00.000Z',
  },
  {
    id: 'recruit-trend-2026',
    title: '2026年エンジニア採用市場レポートを公開',
    category: 'Report',
    tag: 'リサーチ',
    eyecatch: { url: 'https://picsum.photos/seed/monoq-news-02/800/500' },
    excerpt: '国内主要企業500社を対象にしたエンジニア採用動向調査の結果をまとめました。スキルベース評価の導入が加速する背景を分析しています。',
    body: '<p>国内主要企業を対象にしたエンジニア採用動向調査の結果をまとめました。経験年数や印象に依存しない、スキルベース評価の導入が加速する背景を分析しています。</p>',
    publishedAt: '2026-05-12T00:00:00.000Z',
  },
  {
    id: 'nikkei-xtech-interview',
    title: '「日経xTECH」に代表・新谷涼花のインタビューが掲載されました',
    category: 'Media',
    tag: '掲載情報',
    eyecatch: { url: 'https://picsum.photos/seed/monoq-news-03/800/500' },
    excerpt: '日経BPが運営する「日経xTECH」にて、当社代表取締役・新谷涼花のインタビュー記事が掲載されました。スキル評価の未来について語っています。',
    body: '<p>日経BPが運営する「日経xTECH」にて、当社代表取締役・新谷涼花のインタビュー記事が掲載されました。スキル評価の未来とMonoQの取り組みについてお話ししています。</p>',
    publishedAt: '2026-04-15T00:00:00.000Z',
  },
  {
    id: 'skill-assessment-insight',
    title: 'スキル評価における属人性の構造的課題について',
    category: 'Insight',
    tag: '考察',
    eyecatch: { url: 'https://picsum.photos/seed/monoq-news-04/800/500' },
    excerpt: 'なぜエンジニアの評価は属人化しやすいのか。その背景にある構造的な要因と、再現性のある評価をつくるための解決策を解説します。',
    body: '<p>なぜエンジニアの評価は属人化しやすいのか。その背景にある構造的な要因と、再現性のある評価をつくるために私たちが取り組む解決策を解説します。</p>',
    publishedAt: '2026-03-30T00:00:00.000Z',
  },
  {
    id: 'osaka-office-open',
    title: '大阪・EDGE本町に本社オフィスを開設しました',
    category: 'Company',
    tag: 'お知らせ',
    eyecatch: { url: 'https://picsum.photos/seed/monoq-news-05/800/500' },
    excerpt: '事業拡大に伴い、本社オフィスを大阪市中央区南本町のEDGE本町3Fに移転しました。',
    body: '<p>事業拡大に伴い、本社オフィスを大阪市中央区南本町のEDGE本町3Fに移転しました。より迅速な意思決定と連携を進めます。</p>',
    publishedAt: '2026-03-10T00:00:00.000Z',
  },
  {
    id: 'company-founded',
    title: 'モノク株式会社を設立しました',
    category: 'Company',
    tag: 'お知らせ',
    eyecatch: { url: 'https://picsum.photos/seed/monoq-news-06/800/500' },
    excerpt: 'エンジニアの実力を正しく評価する社会の実現を目指し、モノク株式会社を設立いたしました。',
    body: '<p>本日、エンジニアの実力を正しく評価する社会の実現を目指し、モノク株式会社を設立いたしました。評価の曖昧さが生む構造的な課題に向き合います。</p>',
    publishedAt: '2026-02-21T00:00:00.000Z',
  },
];

const hasMicroCmsEnv = Boolean(serviceDomain && apiKey);

async function requestMicroCms<T>(path: string, params?: Record<string, string | number>) {
  if (!hasMicroCmsEnv) return null;

  const url = new URL(`https://${serviceDomain}.microcms.io/api/v1/${path}`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    headers: {
      'X-MICROCMS-API-KEY': apiKey,
    },
  });

  if (!response.ok) {
    console.warn(`microCMS fetch failed: ${response.status} ${response.statusText}`);
    return null;
  }

  return response.json() as Promise<T>;
}

export async function getNewsList(limit = 6) {
  const data = await requestMicroCms<MicroCmsListResponse<NewsItem>>(endpoint, {
    limit,
    orders: '-publishedAt',
  });

  return data?.contents?.length ? data.contents : fallbackNews.slice(0, limit);
}

export async function getAllNews() {
  const data = await requestMicroCms<MicroCmsListResponse<NewsItem>>(endpoint, {
    limit: 100,
    orders: '-publishedAt',
  });

  return data?.contents?.length ? data.contents : fallbackNews;
}

export async function getNewsDetail(id: string) {
  const data = await requestMicroCms<NewsItem>(`${endpoint}/${id}`);
  return data ?? fallbackNews.find((item) => item.id === id) ?? null;
}

export function formatNewsDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date).replaceAll('/', '.');
}
