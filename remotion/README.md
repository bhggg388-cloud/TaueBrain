# 分子接近の物語 — Remotion 版

出典論文が示した分子機構を、6シーン・1分40秒のモーショングラフィックスとして
MP4 に書き出すための Remotion プロジェクトです。

HTML プレビュー版（リポジトリ直下の `drug-mechanism-video.html`）と同じ台本・
同じ構図ですが、こちらは本物の動画ファイルを出力します。PowerPoint への貼り付け、
配信、上映のいずれにも使えます。

## 出力方法

```bash
cd remotion
npm install
npm run music                 # 楽曲を public/score.wav に書き出す（初回のみ）
npx remotion render Story out/drug-mechanism-video.mp4 \
  --browser-executable=/path/to/chrome
```

`--browser-executable` は、Remotion が自前の Chrome を取得できない環境でのみ必要です。
通常の環境では省略でき、初回レンダリング時に自動で取得されます。

編集しながら確認する場合は `npx remotion studio` でプレビューが開きます。

## 構成

| ファイル | 内容 |
|---|---|
| `src/timeline.mjs` | 台本・字幕・和音進行・カット割り。**映像と音楽の唯一の情報源** |
| `src/Story.tsx` | 全6シーンの描画 |
| `src/geometry.ts` | 化学構造式、タンパク質リボン、ビーズ鎖の座標 |
| `src/particles.ts` | 星屑・粒子・ネットワークの配置 |
| `scripts/render-music.mjs` | 楽曲を WAV に合成するオフライン音源 |

`timeline.mjs` を映像と音楽の両方が読み込むため、字幕のタイミングを変えれば
音楽のダッキングも自動的に追従します。

## 差し替え箇所

- **社名・プロジェクト名** — `src/Story.tsx` の `END_TITLE`
- **学術ラベルの実名／抽象表現** — `src/Story.tsx` の `SCI_LABELS`
  （`true` で cereblon・Ikaros / Aiolos などの実名、`false` で「足場タンパク質」等の抽象表現）
- **字幕とタイミング** — `src/timeline.mjs` の `CAPTIONS`

## ナレーションについて

現在の MP4 には**音楽のみ**が入っています。HTML プレビュー版のナレーションは
ブラウザの音声合成機能を再生時に呼び出すもので、ファイルとして書き出せないためです。

ナレーションを載せる場合は、次のいずれかになります。

1. 収録した音声を `public/narration.wav` として置き、`src/Story.tsx` に
   `<Audio src={staticFile('narration.wav')} />` を追加する（推奨）
2. 音声合成サービスで各字幕を書き出し、同様に読み込む

字幕は `timeline.mjs` の `CAPTIONS` にナレーション原稿と同一の文言で入っているので、
収録用の台本としてそのまま使えます。

## ライセンス上の注意

Remotion は個人および小規模事業者には無償ですが、**従業員4名以上の企業が業務で
使う場合は有償の企業ライセンスが必要**です。社内利用の可否をご確認ください。
条件は https://remotion.dev/license に記載されています。

## 図版の扱い

画面内の描画はすべて本動画のために作成したオリジナルです。出典論文に掲載された
図版そのものは転載していません（学術誌の図の転載には出版社の許諾が必要なため）。
引用番号は各シーンが依拠する知見の出典を示すものです。

化学構造は本剤クラスに共通する骨格を様式化して描いたもので、特定化合物の正確な
構造式ではありません。
