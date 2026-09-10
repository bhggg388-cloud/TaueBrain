# CELMoD はこうして生まれた — Remotion 版

「CELMoD はこうして生まれた（台本 v3・社内検討用資料）」の分子機構を、
6シーン・3分00秒のモーショングラフィックスとして MP4 に書き出すための
Remotion プロジェクトです。

HTML プレビュー版（リポジトリ直下の `drug-mechanism-video.html`）と同じ台本・
同じ構図ですが、こちらは本物の動画ファイルを出力します。PowerPoint への貼り付け、
配信、上映のいずれにも使えます。

> **社内検討用資料。Confidential — Internal use only.**
> 台本の内容は史実・公表文献に基づく構成であり、演出上の脚色を含みます。
> **医学的内容の正確性は Medical の正式レビューを別途要します。**

## バージョンについて

`Story`（既定のコンポジション）は Three.js/WebGL による本物の3D描画版です。
分子・プロテアソーム・CRBNクランプ・免疫細胞などを実メッシュ＋キーフレーム
カメラワークで描画しています。従来のフラットな2D SVG風の描画は
`StoryClassic2D` として残しています。

WebGLのポストプロセス（Bloom/被写界深度/色収差などの `EffectComposer`）は、
このプロジェクトの検証環境（ソフトウェアWebGLレンダラー）では一部シーンで
フレーム全体が真っ黒になる不具合が再現したため、`Story3D.tsx` では使用して
いません。ビネット・粒状感はWebGLパスを介さないCSSオーバーレイで代替して
います。実GPU環境でレンダリングする場合は `src/three/PostFX.tsx`
（`TestThree` 用に残してあります）を `Scene` に組み込み直すことで、本来の
ポストプロセスを有効化できます。

## 出力方法

```bash
cd remotion
npm install
npm run music                 # 楽曲を public/score.wav に書き出す（初回のみ）
npx remotion render Story out/drug-mechanism-video.mp4 \
  --browser-executable=/path/to/chrome
```

`--browser-executable` は、Remotion が自前の Chrome を取得できない環境でのみ必要です。
通常の環境では省略でき、初回レンダリング時に自動で取得されます。Chrome の
「Old Headless」が使えない環境（`Old Headless mode has been removed` エラーが出る場合）は、
`chrome-headless-shell` の実行ファイルを指定してください。

編集しながら確認する場合は `npx remotion studio` でプレビューが開きます。

## 構成

| ファイル | 内容 |
|---|---|
| `src/timeline.mjs` | 台本・字幕・和音進行・カット割り。**映像と音楽の唯一の情報源** |
| `src/Story3D.tsx` | 既定の3D版（`Story`）の描画。カメラリグ・シーン構成 |
| `src/three/*.tsx` | 3D版で使う分子・リボン・プロテアソーム・細胞・クランプ等のメッシュ |
| `src/Story.tsx` | 旧2D版（`StoryClassic2D`）の描画 |
| `src/geometry.ts` | （2D版用）化学構造式、タンパク質リボン、ビーズ鎖の座標 |
| `src/particles.ts` | （2D版用）星屑・粒子・ネットワークの配置 |
| `scripts/render-music.mjs` | 楽曲を WAV に合成するオフライン音源 |

`timeline.mjs` を映像と音楽の両方が読み込むため、字幕のタイミングを変えれば
音楽のダッキングも自動的に追従します。`Story.tsx` 側の時間しきい値
（`smoothstep(...)` の引数や `t < N` の形の比較）も、シーン境界（`S2`〜`S6`、
`CUE.*`）からの相対位置を保つよう時間伸縮（プロポーショナル・ワープ）済みです。
台本を差し替えて尺を変える場合は、この考え方（シーンごとの拡大率を掛けて
literal な時刻を移動する）を踏襲してください。

## シーン構成（台本 v3）

| 尺 | シーン | 出典 |
|---|---|---|
| 0:00–0:23 | 場面1・謎 | [1,2,3,4] |
| 0:23–0:52 | 場面2・同じ年、別々の場所（Krönke / Lu / Gandhi, 2014） | [5,6,7] |
| 0:52–1:23 | 場面3・答えが見つかった（セレブロン→Aiolos/Ikaros分解） | [5,6] |
| 1:23–1:52 | 場面4・同じ手がかりから、二つの道を歩いた（CC-220/Iberdomide→Mezigdomide） | [8,9,10] |
| 1:52–2:39 | 場面5・併せ持つ2つの効果（骨髄腫細胞への効果＋免疫細胞への効果） | [9,10,11,12] |
| 2:39–3:00 | 場面6・新しい時代が始まる（CELMoDsの誕生） | — |

## 全出典リスト

1. Singhal S, et al. N Engl J Med. 1999;341(21):1565-1571.
2. VanRhee F, et al. Blood. 2008;112(4):1035-1038.
3. Chen C, et al. Br J Haematol. 2009;146(2):164-170.
4. San Miguel JF, et al. Lancet Oncol. 2013;14(11):1055-1066.
5. Krönke J, et al. Science. 2014;343(6168):301-305.
6. Lu G, et al. Science. 2014;343(6168):305-309.
7. Gandhi AK, et al. Br J Haematol. 2014.
8. Matyskiela ME, et al. J Med Chem. 2018;61(2):535-542.（Iberdomide = CC-220）
9. Hansen JD, et al. J Med Chem. 2020;63(13):6648-6676.（Mezigdomide）
10. Thakurta A, et al. Oncotarget. 2021;12(15):1555-1563.
11. Watson ER, et al. Science. 2022;378(6619):549-553.
12. Richardson PG, et al. N Engl J Med. 2023;389(11):1009-1022.

## 差し替え箇所

- **社名・プロジェクト名（エンドカードの見出し）** — `src/Story.tsx` の `END_TITLE`
  （現在は台本タイトル「CELMoD はこうして生まれた」を仮に入れています）
- **学術ラベルの実名／抽象表現** — `src/Story.tsx` の `SCI_LABELS`
  （`true` でセレブロン・Aiolos/Ikaros・CC-220・Mezigdomide などの実名、
  `false` で「足場タンパク質」等の抽象表現）
- **字幕とタイミング** — `src/timeline.mjs` の `CAPTIONS`（台本 v3 の文言に準拠）

## ナレーションについて

現在の MP4 には**音楽のみ**が入っています。HTML プレビュー版のナレーションは
ブラウザの音声合成機能を再生時に呼び出すもので、ファイルとして書き出せないためです。

ナレーションを載せる場合は、次のいずれかになります。

1. 収録した音声を `public/narration.wav` として置き、`src/Story.tsx` に
   `<Audio src={staticFile('narration.wav')} />` を追加する（推奨）
2. 音声合成サービスで各字幕を書き出し、同様に読み込む（医学用語の発音精度は
   要確認 — Krönke、cereblon、Iberdomide、Mezigdomide などの固有名詞・薬剤名）

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
