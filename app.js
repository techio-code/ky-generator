// ================================
// 現場KYジェネレーター - メインロジック
// 気象庁API連動型 危険予知活動シート自動生成
// ================================

// --- 都道府県コード一覧 ---
const REGIONS = [
  { code: '016000', name: '北海道（札幌）' },
  { code: '020000', name: '青森県' },
  { code: '030000', name: '岩手県' },
  { code: '040000', name: '宮城県' },
  { code: '050000', name: '秋田県' },
  { code: '060000', name: '山形県' },
  { code: '070000', name: '福島県' },
  { code: '080000', name: '茨城県' },
  { code: '090000', name: '栃木県' },
  { code: '100000', name: '群馬県' },
  { code: '110000', name: '埼玉県' },
  { code: '120000', name: '千葉県' },
  { code: '130000', name: '東京都' },
  { code: '140000', name: '神奈川県' },
  { code: '150000', name: '新潟県' },
  { code: '160000', name: '富山県' },
  { code: '170000', name: '石川県' },
  { code: '180000', name: '福井県' },
  { code: '190000', name: '山梨県' },
  { code: '200000', name: '長野県' },
  { code: '210000', name: '岐阜県' },
  { code: '220000', name: '静岡県' },
  { code: '230000', name: '愛知県' },
  { code: '240000', name: '三重県' },
  { code: '250000', name: '滋賀県' },
  { code: '260000', name: '京都府' },
  { code: '270000', name: '大阪府' },
  { code: '280000', name: '兵庫県' },
  { code: '290000', name: '奈良県' },
  { code: '300000', name: '和歌山県' },
  { code: '310000', name: '鳥取県' },
  { code: '320000', name: '島根県' },
  { code: '330000', name: '岡山県' },
  { code: '340000', name: '広島県' },
  { code: '350000', name: '山口県' },
  { code: '360000', name: '徳島県' },
  { code: '370000', name: '香川県' },
  { code: '380000', name: '愛媛県' },
  { code: '390000', name: '高知県' },
  { code: '400000', name: '福岡県' },
  { code: '410000', name: '佐賀県' },
  { code: '420000', name: '長崎県' },
  { code: '430000', name: '熊本県' },
  { code: '440000', name: '大分県' },
  { code: '450000', name: '宮崎県' },
  { code: '460100', name: '鹿児島県' },
  { code: '471000', name: '沖縄県' },
];

// --- 作業ごとの危険ポイント ---
const WORK_DANGERS = {
  scaffold: {
    name: '足場作業',
    dangers: [
      '足場板の隙間や段差でのつまずき・転落',
      '足場の組立・解体時の部材落下',
      '墜落制止用器具（安全帯）の未使用・不適切な使用',
      '足場の固定不良による倒壊',
      '手すり・中さんの未設置箇所からの転落',
    ],
    actions: [
      '作業前に足場の点検を実施し、異常箇所を修繕する',
      '墜落制止用器具のフックを必ず掛ける',
      '足場板のすき間が3cm以上ないか確認する',
      '昇降時は三点支持を徹底する',
      '工具は腰袋に入れ、落下防止措置を行う',
    ],
  },
  height: {
    name: '高所作業',
    dangers: [
      '開口部・端部からの墜落',
      '高所での工具・資材の落下',
      '作業車（高所作業車）の転倒',
      'はしご・脚立の不安定な設置',
      '高所での強風による体勢崩れ',
    ],
    actions: [
      '2m以上の高所作業では墜落制止用器具を必ず使用する',
      '開口部には手すり・覆いを設置し、表示を行う',
      '工具にはストラップをつけ落下防止を行う',
      '高所作業車の作業前点検を実施する',
      '立入禁止区域を設定し、下方の安全を確保する',
    ],
  },
  excavation: {
    name: '掘削作業',
    dangers: [
      '掘削面の崩壊・土砂崩れ',
      '埋設物（ガス管・水道管・電気ケーブル）の損傷',
      '重機との接触事故',
      '掘削溝への転落',
      '地下水の湧出による地盤軟弱化',
    ],
    actions: [
      '掘削前に埋設物の位置を確認し、試掘を行う',
      '1.5m以上の掘削には土留めを設置する',
      '重機の旋回範囲内に立入禁止措置を行う',
      '掘削溝の周辺にバリケードを設置する',
      '地山の状態を常に確認し、亀裂や湧水に注意する',
    ],
  },
  concrete: {
    name: 'コンクリート打設',
    dangers: [
      'ポンプ車のブーム接触・転倒',
      'コンクリート飛散による目への障害',
      'バイブレータの電気感電',
      '型枠の膨張・破損による倒壊',
      'スラブ上での足場不良・転倒',
    ],
    actions: [
      'ポンプ車のアウトリガーを確実に張り出す',
      '保護メガネ・ゴム手袋を着用する',
      '打設前に型枠・支保工の点検を実施する',
      'バイブレータのアース接続を確認する',
      '打設順序と打設速度を事前に打合せする',
    ],
  },
  welding: {
    name: '溶接・溶断',
    dangers: [
      '火花・スパッタによる火災',
      'アーク光による目の損傷（電光性眼炎）',
      '溶接ヒュームの吸引による健康障害',
      'ガスボンベの転倒・漏洩',
      '感電事故',
    ],
    actions: [
      '周囲の可燃物を除去し、防火シートを設置する',
      '遮光面・保護メガネを必ず着用する',
      '換気を十分に行い、必要に応じて防じんマスクを着用する',
      'ガスボンベは鎖で固定し、火気から5m以上離す',
      '消火器を手元に配置する',
    ],
  },
  crane: {
    name: 'クレーン作業',
    dangers: [
      '吊荷の落下',
      'クレーンの転倒',
      '吊荷との接触・挟まれ',
      '電線への接触感電',
      '合図の不徹底による事故',
    ],
    actions: [
      '定格荷重を確認し、過負荷を防止する',
      'アウトリガーを最大限に張り出し、地盤を確認する',
      '玉掛け作業者の資格を確認する',
      '吊荷の下に立入禁止措置を行う',
      '合図者を指名し、合図方法を統一する',
    ],
  },
  electrical: {
    name: '電気工事',
    dangers: [
      '充電部への接触による感電',
      '漏電による感電・火災',
      '活線近接作業での感電',
      'ケーブルドラムの転倒',
      '通電状態の確認不足',
    ],
    actions: [
      '作業前に検電器で通電確認を行う',
      '電源遮断→検電→接地の手順を徹底する',
      '絶縁用保護具（手袋・長靴）を着用する',
      '「通電禁止」の表示と施錠を行う',
      '漏電遮断器の動作確認を行う',
    ],
  },
  demolition: {
    name: '解体作業',
    dangers: [
      '建物の予期しない倒壊',
      '粉じん・アスベストの飛散',
      '重機と作業員の接触',
      '解体材の落下・飛散',
      '振動・騒音による近隣への影響',
    ],
    actions: [
      '解体計画書に基づき、手順を遵守する',
      '防じんマスク・保護メガネを着用する',
      'アスベスト調査を事前に実施する',
      '解体範囲を明確にし、立入禁止区域を設定する',
      '散水を行い、粉じんの飛散を防止する',
    ],
  },
  painting: {
    name: '塗装作業',
    dangers: [
      '有機溶剤による中毒・健康障害',
      '引火性塗料による火災・爆発',
      '足場・脚立からの転落',
      '飛散による目・皮膚への障害',
      '換気不足による酸素欠乏',
    ],
    actions: [
      '有機溶剤用の防毒マスクを着用する',
      '十分な換気を確保する（機械換気を併用）',
      '火気厳禁の表示を行い、火種を排除する',
      '保護メガネ・保護手袋を着用する',
      '塗料の保管場所を消防法に基づき管理する',
    ],
  },
  transport: {
    name: '重機・運搬',
    dangers: [
      '重機と作業員の接触事故',
      'バック走行時の巻込み',
      '積荷の転倒・落下',
      '運搬路の不整備による転倒',
      '重機の旋回範囲内での接触',
    ],
    actions: [
      '誘導員を配置し、合図を確認してから発進する',
      'バック時は後方確認を徹底し、警報器を使用する',
      '積荷はロープで固定し、過積載をしない',
      '運搬経路を事前に確認し、段差・障害物を除去する',
      '重機の旋回範囲にバリケードを設置する',
    ],
  },
  plumbing: {
    name: '配管作業',
    dangers: [
      '重量配管の落下・挟まれ',
      '溶接・ロウ付け時の火傷',
      '狭所での酸素欠乏',
      '配管内の残留物（高温水・ガス）による事故',
      '配管支持の不備による落下',
    ],
    actions: [
      '配管の吊込みにはチェーンブロックを使用する',
      '既設配管の残留物を確認してから作業に着手する',
      '狭所作業では換気と酸素濃度測定を行う',
      '溶接作業時は火災防止措置を行う',
      '配管支持金物の強度を確認する',
    ],
  },
  roofing: {
    name: '屋根作業',
    dangers: [
      '屋根端部からの墜落',
      '屋根材（スレート等）の踏み抜き',
      '屋根上での滑り・転倒',
      '屋根材の風による飛散',
      '夏場の屋根表面の高温による熱中症',
    ],
    actions: [
      '親綱を設置し、墜落制止用器具を使用する',
      '歩み板を設置し、踏み抜きを防止する',
      '滑り止め付きの靴を着用する',
      '強風時は作業を中止する',
      '軒先・ケラバには手すりを設置する',
    ],
  },
  // --- ゼネコン追加作業 ---
  formwork: {
    name: '型枠工事',
    dangers: [
      '型枠パネルの落下・倒壊',
      '型枠解体時の残存釘・番線による刺傷',
      'セパレーターの突起による引っ掛かり・転倒',
      '型枠支保工の崩壊',
      '重量パネルの運搬時の腰痛・挟まれ',
    ],
    actions: [
      '型枠支保工の組立図に基づき施工する',
      '解体時は釘抜き・番線処理を確実に行う',
      'コンクリート打設前に型枠の寸法・固定を確認する',
      '重量物は2人以上で運搬する',
      'セパ穴の養生を確認する',
    ],
  },
  rebar: {
    name: '鉄筋工事',
    dangers: [
      '鉄筋の端部による刺傷・突き刺し',
      '鉄筋の結束時の手指の切傷',
      '鉄筋組立中の墜落',
      '重量鉄筋の落下・挟まれ',
      '鉄筋のはね返りによる打撲',
    ],
    actions: [
      '鉄筋の端部にキャップを取り付ける',
      '防切創手袋を着用する',
      '鉄筋の上を歩く際は歩み板を使用する',
      '玉掛けワイヤーの点検を実施する',
      '鉄筋運搬時は合図を確認してから移動する',
    ],
  },
  steel: {
    name: '鉄骨建方',
    dangers: [
      '鉄骨部材の落下・倒壊',
      '建方時の高所からの墜落',
      'ボルト締付時の工具落下',
      'クレーンとの共同作業での接触',
      '鉄骨のエッジによる切傷',
    ],
    actions: [
      '建方計画書に基づき施工手順を遵守する',
      '仮ボルトの本数を規定数以上確保する',
      '鳶工は墜落制止用器具を常時使用する',
      '合図者を専任し、クレーンとの連携を確認する',
      '工具に落下防止ストラップをつける',
    ],
  },
  piling: {
    name: '杭打ち工事',
    dangers: [
      '杭打ち機の転倒',
      '騒音・振動による近隣トラブルと作業者の健康障害',
      '掘削土砂の崩壊',
      '重機との接触事故',
      '安定液の漏洩・汚染',
    ],
    actions: [
      '杭打ち機の設置地盤の支持力を確認する',
      '防音・防振対策を実施する',
      '作業範囲内の立入禁止措置を徹底する',
      '排泥の処理方法を事前に確認する',
      '杭芯の測量確認を作業前に実施する',
    ],
  },
  survey: {
    name: '測量・墨出し',
    dangers: [
      '開口部・段差への転落',
      '暗所での転倒',
      '重機稼働エリアでの接触',
      '測量機器運搬時の腰痛',
      '高所での測量作業中の墜落',
    ],
    actions: [
      '開口部の養生を確認してから作業する',
      '暗所ではヘッドライト・投光器を使用する',
      '重機稼働エリアには合図なく近づかない',
      '高所での測量は墜落制止用器具を使用する',
      '他業者との作業エリアの調整を行う',
    ],
  },
  safety_patrol: {
    name: '安全巡視',
    dangers: [
      '巡視中の上方からの落下物',
      '足元の不整地・開口部への転落',
      '重機の旋回範囲内への進入',
      '作業中の第三者との接触',
      '仮設通路の不備による転倒',
    ],
    actions: [
      '保護帽・安全靴・反射ベストを着用する',
      '上方作業の有無を確認してから通過する',
      '重機のオペレーターに合図してから接近する',
      '巡視チェックリストに基づき確認する',
      '是正箇所は写真記録し、速やかに報告する',
    ],
  },
  material: {
    name: '資材搬入・搬出',
    dangers: [
      'トラックの荷降ろし時の荷崩れ',
      'フォークリフトとの接触',
      '重量物の手運搬による腰痛',
      '仮置き資材の転倒・落下',
      '搬入経路での第三者との接触',
    ],
    actions: [
      '荷降ろし時は荷崩れ防止措置を確認する',
      'フォークリフトの走行区域に立入禁止措置を行う',
      '重量物は台車・クレーンを使用し、手運搬を避ける',
      '資材の仮置きは転倒防止措置を行う',
      '搬入車両の誘導員を配置する',
    ],
  },
  // --- サブコン追加作業 ---
  electrical_panel: {
    name: '分電盤・受変電',
    dangers: [
      '高圧充電部への接触による感電死亡',
      '短絡（ショート）によるアーク爆発',
      '遮断器操作ミスによる感電',
      '開閉器内の残留電荷による感電',
      '狭い電気室での転倒・つまずき',
    ],
    actions: [
      '停電作業の手順書を作成し、関係者に周知する',
      '「停電中・通電禁止」の表示と施錠を行う',
      '検電器で全相の無電圧を確認する',
      '絶縁用保護具を着用する',
      '短絡接地器具を取り付けてから作業する',
    ],
  },
  communication: {
    name: '通信・弱電工事',
    dangers: [
      '天井裏での作業姿勢の不良による腰痛',
      '天井ボード踏み抜きによる転落',
      '既設配線の誤切断',
      'ケーブルラック上での高所作業中の墜落',
      'LANケーブル敷設時のつまずき',
    ],
    actions: [
      '天井裏では歩み板を使用する',
      '既設配線の確認を行ってから作業する',
      '脚立は正しい向きで設置し、天板に乗らない',
      'ケーブルは養生テープで仮固定し、つまずき防止する',
      '通線時は2人以上で作業する',
    ],
  },
  lighting: {
    name: '照明・器具取付',
    dangers: [
      '脚立・はしごからの転落',
      '天井作業での首・肩の疲労による不注意',
      '照明器具の落下',
      '通電状態での器具取付による感電',
      '重量器具の取付時の落下・挟まれ',
    ],
    actions: [
      '脚立は水平な場所に設置し、開き止めを掛ける',
      '器具取付前にブレーカーをOFFにする',
      '重量器具は支持金物の強度を確認してから取付する',
      '上向き作業は適度に休憩を挟む',
      '落下防止ワイヤーを設置する',
    ],
  },
  hvac: {
    name: '空調ダクト工事',
    dangers: [
      '重量ダクトの落下・挟まれ',
      '高所での吊込み作業中の墜落',
      'ダクトのエッジによる切傷',
      '天井裏での酸欠・粉じん吸入',
      'アンカー施工時の粉じん飛散',
    ],
    actions: [
      'ダクトの吊り金物の強度を確認する',
      '切断面のバリ取りを行い、革手袋を着用する',
      '天井裏では防じんマスクを着用する',
      'アンカー施工時は保護メガネを着用する',
      '吊込み作業は合図者を配置して実施する',
    ],
  },
  fire_protection: {
    name: '消防設備工事',
    dangers: [
      'スプリンクラー配管の重量物落下',
      '溶接・ロウ付け時の火災',
      '消火薬剤の誤放出',
      '天井裏作業での転落・踏み抜き',
      '既設配管の残圧による事故',
    ],
    actions: [
      '溶接作業前に周囲の可燃物を除去する',
      '消火器を手元に配置する',
      '既設配管の残圧を確認してから切断する',
      '天井裏では歩み板を使用し墜落防止する',
      '消火設備の誤作動防止措置を行う',
    ],
  },
  tiling: {
    name: 'タイル・左官',
    dangers: [
      '重量タイルの落下',
      'モルタル・接着剤による皮膚障害',
      'タイルカット時の粉じん吸入',
      '脚立作業での転落',
      '濡れた床面での転倒',
    ],
    actions: [
      'タイルカット時は保護メガネ・防じんマスクを着用する',
      'ゴム手袋を着用し、肌への直接接触を防ぐ',
      '作業場所の整理整頓を行い、通路を確保する',
      '脚立は安定した場所に設置する',
      '床の養生を行い、滑り止め対策をする',
    ],
  },
  interior: {
    name: '内装仕上げ',
    dangers: [
      'カッターナイフによる切傷',
      '軽量鉄骨（LGS）のエッジによる切傷',
      '脚立・ローリングタワーからの転落',
      '接着剤・シンナーによる有機溶剤中毒',
      'ボード運搬時の腰痛・手指の挟まれ',
    ],
    actions: [
      'カッター使用時は安全カッターを使い、刃の管理を行う',
      '革手袋を着用しLGSの切断面に注意する',
      '有機溶剤使用時は換気を十分に行う',
      'ボード運搬は2人以上で行う',
      'ローリングタワーのブレーキを確認してから使用する',
    ],
  },
  waterproofing: {
    name: '防水工事',
    dangers: [
      'トーチバーナーの使用による火災',
      '防水材の有機溶剤による中毒',
      '屋上端部からの墜落',
      '高温のアスファルトによる火傷',
      '膝をつく作業での身体的負担',
    ],
    actions: [
      'バーナー使用時は消火器を手元に配置する',
      '防毒マスクを着用し、風上で作業する',
      '屋上端部に手すり・親綱を設置する',
      '耐熱手袋・長袖作業服を着用する',
      '膝当てを使用し、適度に休憩を取る',
    ],
  },
  exterior: {
    name: '外壁・ALC工事',
    dangers: [
      'ALC板の落下・倒壊',
      '高所での取付作業中の墜落',
      '重量パネルの挟まれ',
      'シーリング材による皮膚障害',
      '強風時のパネル飛散',
    ],
    actions: [
      'ALC板の玉掛けは吊りクランプの適正使用を確認する',
      '墜落制止用器具を確実に使用する',
      '強風時（10m/s以上）はパネル揚重を中止する',
      'シーリング作業時はゴム手袋を着用する',
      '仮置きパネルは転倒防止措置を行う',
    ],
  },
  glazing: {
    name: 'サッシ・ガラス',
    dangers: [
      'ガラスの破損による切傷',
      '重量サッシの落下・挟まれ',
      '高所での取付作業中の墜落',
      'ガラス運搬時の割れ・飛散',
      '開口部作業中の転落',
    ],
    actions: [
      '防切創手袋・保護メガネを着用する',
      'ガラスの運搬は専用の吸盤器具を使用する',
      '開口部に手すり・墜落防止ネットを設置する',
      '風速が強い場合はガラス取付を中止する',
      '破損ガラスの処理は専用容器に入れる',
    ],
  },
};

// --- 天気に応じたリスク ---
const WEATHER_RISKS = {
  rain: {
    tag: { label: '☔ 雨天リスク', class: 'risk-high' },
    risks: [
      '路面・足場が滑りやすくなり、転倒・転落の危険が増大',
      '視界不良による作業ミス・接触事故のリスク上昇',
      '電気機器の漏電リスクが高まる',
      '掘削面の崩壊リスクが上昇',
      '資材や工具が濡れて取り扱いにくくなる',
    ],
    actions: [
      '滑り止め付きの安全靴を着用し、歩行時は慎重に',
      '電気機器のアース・漏電遮断器を再確認',
      '足場上に滑り止めマットを敷く',
      '雨天中止の判断基準を事前に確認する',
    ],
    alert: {
      level: 'high',
      title: '⚠️ 雨天注意報',
      text: '雨天時は転倒・感電リスクが大幅に上昇します。足場作業・高所作業は中止基準を確認してください。',
    },
  },
  heavyRain: {
    tag: { label: '⛈️ 大雨リスク', class: 'risk-high' },
    risks: [
      '大雨による視界ゼロで作業継続困難',
      '河川の増水・土砂災害の危険',
      '掘削箇所への浸水・地盤崩壊の恐れ',
      '雷による感電事故の危険',
      '仮設構造物の倒壊リスク',
    ],
    actions: [
      '大雨警報発令時は全作業を中止し、安全な場所へ退避',
      '排水ポンプの稼働状況を確認',
      '土砂災害の前兆（地鳴り・湧水の濁り）に注意する',
      '雷が近づいたら直ちにクレーン作業を中止する',
    ],
    alert: {
      level: 'high',
      title: '🚨 大雨警戒',
      text: '大雨が予想されます。屋外作業の中止判断を早めに行い、排水・土砂対策を確認してください。',
    },
  },
  snow: {
    tag: { label: '❄️ 降雪リスク', class: 'risk-high' },
    risks: [
      '積雪による足場・通路の滑り',
      '屋根・足場上の積雪荷重による倒壊',
      '凍結路面でのスリップ事故',
      '降雪時の視界不良',
      '手がかじかんで工具の把持力低下',
    ],
    actions: [
      '除雪・融雪剤の散布を行う',
      '防寒具・滑り止め靴を着用する',
      '足場上の積雪を除去してから作業開始する',
      '重機の暖機運転を十分に行う',
    ],
    alert: {
      level: 'high',
      title: '❄️ 降雪注意',
      text: '降雪が予想されます。足場・通路の除雪、凍結対策を実施してください。',
    },
  },
  wind: {
    tag: { label: '💨 強風リスク', class: 'risk-high' },
    risks: [
      '強風によるクレーン作業の中止基準超過',
      '足場シート・養生材の飛散',
      '高所作業での体勢崩れ・転落',
      '仮設物の倒壊',
      '粉じんの飛散による視界不良',
    ],
    actions: [
      '風速10m/s以上でクレーン作業・高所作業を中止する',
      '足場シート・養生材をたたむか固定する',
      '資材の飛散防止措置（ロープ固定・重し）を行う',
      '作業開始前と午後に風速を測定する',
    ],
    alert: {
      level: 'high',
      title: '💨 強風警戒',
      text: '強風が予想されます。クレーン・高所作業の中止基準を確認し、飛散防止措置を実施してください。',
    },
  },
  hot: {
    tag: { label: '🌡️ 猛暑リスク', class: 'risk-high' },
    risks: [
      '熱中症による体調不良・意識障害',
      '大量発汗による集中力低下・作業ミス',
      '直射日光下での脱水症状',
      '高温の鋼材・コンクリート面での火傷',
      '暑さによる焦り・不安全行動の増加',
    ],
    actions: [
      'WBGT値を測定し、基準値を超えたら休憩を取る',
      '30分に1回の水分補給（塩分含む）を徹底する',
      '日除けテント・送風機を設置する',
      '体調不良者が出た場合の救急体制を確認する',
      '午前10時〜午後3時は特に注意し、適宜休憩を入れる',
    ],
    alert: {
      level: 'high',
      title: '🌡️ 熱中症警戒',
      text: '気温が高くなる予報です。こまめな水分補給・休憩を徹底し、体調管理に注意してください。',
    },
  },
  warm: {
    tag: { label: '☀️ 暑さ注意', class: 'risk-mid' },
    risks: [
      '気温上昇に伴う熱中症リスク',
      '汗による保護具のずれ・不快感',
      '午後の気温上昇で集中力が低下',
    ],
    actions: [
      'こまめな水分補給を心がける',
      '休憩場所に日除けを用意する',
      '体調が優れない場合は申告する',
    ],
    alert: null,
  },
  cold: {
    tag: { label: '🥶 寒冷リスク', class: 'risk-mid' },
    risks: [
      '手がかじかんで工具の操作ミス',
      '体の動きが鈍くなり反応が遅れる',
      '路面の凍結による転倒',
    ],
    actions: [
      '防寒具を着用し、適度に体を動かして体温を維持する',
      '朝一番は路面凍結に注意して歩行する',
      '暖を取る休憩場所を確保する',
    ],
    alert: null,
  },
  cloudy: {
    tag: { label: '☁️ 曇天', class: 'risk-low' },
    risks: [
      '曇天時は突然の降雨に注意',
      '薄暗い場合は照明を確保する',
    ],
    actions: [
      '天気の急変に備え、雨具を準備する',
      '必要に応じて作業灯を設置する',
    ],
    alert: null,
  },
  clear: {
    tag: { label: '☀️ 晴天', class: 'risk-low' },
    risks: [
      '直射日光による眩しさで視界が悪化する場合がある',
      '晴天時の紫外線による日焼け・目の疲労',
    ],
    actions: [
      '必要に応じてサングラス・つば付きヘルメットを着用する',
      '水分補給をこまめに行う',
    ],
    alert: null,
  },
};

// --- 安全目標テンプレート ---
const SAFETY_GOALS = {
  rain: [
    '「足元注意！ 一歩一歩確認して歩こう」',
    '「雨の日こそ慎重に！ 滑り止め確認してから作業開始」',
    '「濡れた手で電気に触るな！ 確認してから作業しよう」',
  ],
  hot: [
    '「水分補給は命綱！ のどが渇く前に飲もう」',
    '「暑さに負けるな！ 休憩は恥ずかしくない」',
    '「仲間の体調にも目を配ろう！ 声掛けで熱中症ゼロ」',
  ],
  cold: [
    '「寒さで手がかじかむ前に、ストレッチで体をほぐそう」',
    '「凍結路面に注意！ 急がず一歩ずつ」',
  ],
  wind: [
    '「飛ばされるものはないか？ 作業前に周囲を確認！」',
    '「強風時は無理をしない！ 中止の判断も勇気」',
  ],
  snow: [
    '「除雪してから作業開始！ 足元の安全は自分で作る」',
    '「凍結注意！ 転ぶ前に滑り止め確認」',
  ],
  default: [
    '「今日も一日、ゼロ災でいこう！ ヨシ！」',
    '「基本動作の徹底！ 慣れた作業こそ確認を怠るな」',
    '「指差し呼称で安全確認！ ヨシ！」',
    '「一人ひとりが安全の主役！ 声を掛け合おう」',
    '「ルールを守って、全員無事故！」',
  ],
};

// --- グローバル状態 ---
let currentWeather = null;
let selectedWork = null;
let selectedRegionName = '';
let weeklyForecasts = []; // 週間予報データ
let selectedDateIndex = 0; // 選択された日付のインデックス

// --- 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
  initRegionSelect();
  initCategoryTabs();
  initWorkButtons();
  initGenerateButton();
  initActionButtons();
});

// --- 地域セレクトボックスの初期化 ---
function initRegionSelect() {
  const select = document.getElementById('regionSelect');
  REGIONS.forEach(region => {
    const option = document.createElement('option');
    option.value = region.code;
    option.textContent = region.name;
    select.appendChild(option);
  });

  select.addEventListener('change', async (e) => {
    const code = e.target.value;
    if (!code) {
      document.getElementById('weatherDisplay').classList.add('hidden');
      currentWeather = null;
      updateGenerateButton();
      return;
    }
    selectedRegionName = REGIONS.find(r => r.code === code)?.name || '';
    await fetchWeather(code);
    updateGenerateButton();
  });
}

// --- 気象庁APIから天気を取得 ---
async function fetchWeather(regionCode) {
  const display = document.getElementById('weatherDisplay');
  const loading = document.getElementById('weatherLoading');
  const info = document.getElementById('weatherInfo');
  const error = document.getElementById('weatherError');
  const dateSelector = document.getElementById('dateSelector');

  display.classList.remove('hidden');
  loading.classList.remove('hidden');
  info.classList.add('hidden');
  error.classList.add('hidden');
  dateSelector.classList.add('hidden');

  try {
    const response = await fetch(
      `https://www.jma.go.jp/bosai/forecast/data/forecast/${regionCode}.json`
    );
    if (!response.ok) throw new Error('API Error');

    const data = await response.json();
    weeklyForecasts = [];

    // --- data[0]: 今日〜明後日の予報 ---
    const shortForecast = data[0];
    const shortWeathers = shortForecast.timeSeries[0].areas[0].weathers || [];
    const shortWinds = shortForecast.timeSeries[0].areas[0].winds || [];
    const shortDates = shortForecast.timeSeries[0].timeDefines || [];

    // 気温データ（今日・明日）
    let shortTemps = [];
    if (shortForecast.timeSeries[2]) {
      const tempAreas = shortForecast.timeSeries[2].areas[0];
      if (tempAreas && tempAreas.temps) {
        shortTemps = tempAreas.temps;
      }
    }

    // 今日〜明後日を追加
    for (let i = 0; i < shortDates.length && i < shortWeathers.length; i++) {
      const date = new Date(shortDates[i]);
      let tempMin = '--';
      let tempMax = '--';

      // 気温はtimeSeries[2]に2つずつ入っている（最低・最高）
      if (shortTemps.length >= (i + 1) * 2) {
        tempMin = shortTemps[i * 2] || '--';
        tempMax = shortTemps[i * 2 + 1] || '--';
      } else if (i === 0 && shortTemps.length >= 2) {
        tempMin = shortTemps[0] || '--';
        tempMax = shortTemps[1] || '--';
      }

      weeklyForecasts.push({
        date: date,
        weatherText: shortWeathers[i],
        windText: shortWinds[i] || '',
        tempMin: tempMin,
        tempMax: tempMax,
      });
    }

    // --- data[1]: 週間予報（4日目〜7日目） ---
    if (data[1] && data[1].timeSeries) {
      const weeklyTS = data[1].timeSeries[0];
      const weeklyDates = weeklyTS.timeDefines || [];
      const weeklyWeatherCodes = weeklyTS.areas[0].weatherCodes || [];
      const weeklyPops = weeklyTS.areas[0].pops || [];

      // 週間予報の気温
      let weeklyTempMin = [];
      let weeklyTempMax = [];
      if (data[1].timeSeries[1]) {
        const tempArea = data[1].timeSeries[1].areas[0];
        weeklyTempMin = tempArea.tempsMin || [];
        weeklyTempMax = tempArea.tempsMax || [];
      }

      for (let i = 0; i < weeklyDates.length; i++) {
        const date = new Date(weeklyDates[i]);
        // 既に追加済みの日付はスキップ
        const alreadyExists = weeklyForecasts.some(f =>
          f.date.toDateString() === date.toDateString()
        );
        if (alreadyExists) continue;

        const weatherCode = weeklyWeatherCodes[i] || '';
        const weatherText = weatherCodeToText(weatherCode);
        const pop = weeklyPops[i] || '';

        weeklyForecasts.push({
          date: date,
          weatherText: weatherText + (pop ? `（降水確率${pop}%）` : ''),
          windText: '',
          tempMin: weeklyTempMin[i] || '--',
          tempMax: weeklyTempMax[i] || '--',
          weatherCode: weatherCode,
        });
      }
    }

    // 日付選択UIを生成
    buildDateSelector();
    dateSelector.classList.remove('hidden');

    // 初期選択（今日）
    selectedDateIndex = 0;
    selectDate(0);

    loading.classList.add('hidden');
  } catch (err) {
    console.error('Weather fetch error:', err);
    loading.classList.add('hidden');
    error.classList.remove('hidden');
    currentWeather = null;
  }
}

// --- 天気コードをテキストに変換 ---
function weatherCodeToText(code) {
  const codeMap = {
    '100': '晴れ', '101': '晴れ時々くもり', '102': '晴れ一時雨',
    '103': '晴れ時々雨', '104': '晴れ一時雪', '105': '晴れ時々雪',
    '110': '晴れのちくもり', '111': '晴れのち雨', '112': '晴れのち雪',
    '200': 'くもり', '201': 'くもり時々晴れ', '202': 'くもり一時雨',
    '203': 'くもり時々雨', '204': 'くもり一時雪', '205': 'くもり時々雪',
    '210': 'くもりのち晴れ', '211': 'くもりのち雨', '212': 'くもりのち雪',
    '300': '雨', '301': '雨時々晴れ', '302': '雨時々くもり',
    '303': '雨時々雪', '308': '大雨', '311': '雨のち晴れ',
    '313': '雨のちくもり', '314': '雨のち雪',
    '400': '雪', '401': '雪時々晴れ', '402': '雪時々くもり',
    '403': '雪時々雨', '406': '大雪', '411': '雪のち晴れ',
    '413': '雪のちくもり', '414': '雪のち雨',
  };
  return codeMap[code] || '不明';
}

// --- 天気コードからアイコンを取得 ---
function weatherCodeToIcon(code) {
  const codeStr = String(code);
  if (codeStr.startsWith('4')) return '❄️';
  if (codeStr === '308' || codeStr === '406') return '⛈️';
  if (codeStr.startsWith('3')) return '🌧️';
  if (codeStr.startsWith('2')) return '☁️';
  if (codeStr.startsWith('1')) return '☀️';
  return '🌤️';
}

// --- 日付選択UIを構築 ---
function buildDateSelector() {
  const grid = document.getElementById('dateGrid');
  grid.innerHTML = '';
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  weeklyForecasts.forEach((forecast, index) => {
    const btn = document.createElement('button');
    btn.className = 'date-btn';
    if (index === 0) btn.classList.add('selected');

    const d = forecast.date;
    const dayOfWeek = d.getDay();
    const isToday = d.toDateString() === today.toDateString();
    if (isToday) btn.classList.add('today');

    // 天気アイコン
    let icon = '🌤️';
    if (forecast.weatherCode) {
      icon = weatherCodeToIcon(forecast.weatherCode);
    } else {
      const analyzed = analyzeWeather(forecast.weatherText, forecast.windText, forecast.tempMin, forecast.tempMax);
      icon = analyzed.icon;
    }

    const dayClass = dayOfWeek === 0 ? 'sun' : dayOfWeek === 6 ? 'sat' : '';

    // 月の変わり目 or 最初の日付には月を表示
    const showMonth = (index === 0) || (d.getDate() === 1);
    const monthLabel = showMonth ? `<span class="date-month">${d.getMonth() + 1}月</span>` : '';

    btn.innerHTML = `
      ${monthLabel}
      <span class="date-day ${dayClass}">${dayNames[dayOfWeek]}</span>
      <span class="date-num">${d.getDate()}</span>
      <span class="date-weather-icon">${icon}</span>
    `;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedDateIndex = index;
      selectDate(index);
    });

    grid.appendChild(btn);
  });
}

// --- 日付を選択して天気を更新 ---
function selectDate(index) {
  const forecast = weeklyForecasts[index];
  if (!forecast) return;

  const info = document.getElementById('weatherInfo');
  const error = document.getElementById('weatherError');

  currentWeather = analyzeWeather(
    forecast.weatherText,
    forecast.windText,
    forecast.tempMin,
    forecast.tempMax
  );

  // 表示を更新
  document.getElementById('weatherIcon').textContent = currentWeather.icon;
  document.getElementById('weatherText').textContent = forecast.weatherText;
  document.getElementById('weatherTemp').textContent =
    forecast.tempMin !== '--' || forecast.tempMax !== '--'
      ? `最低 ${forecast.tempMin}℃ / 最高 ${forecast.tempMax}℃`
      : '気温情報なし';

  // タグを表示
  const tagsContainer = document.getElementById('weatherTags');
  tagsContainer.innerHTML = '';
  currentWeather.conditions.forEach(condition => {
    const riskData = WEATHER_RISKS[condition];
    if (riskData && riskData.tag) {
      const tag = document.createElement('span');
      tag.className = `weather-tag ${riskData.tag.class}`;
      tag.textContent = riskData.tag.label;
      tagsContainer.appendChild(tag);
    }
  });

  info.classList.remove('hidden');
  error.classList.add('hidden');
  updateGenerateButton();
}

// --- 天気テキストを分析してリスク条件を判定 ---
function analyzeWeather(weatherText, windText, tempMin, tempMax) {
  const conditions = [];
  let icon = '☀️';

  // 天気判定
  if (weatherText.includes('大雨') || weatherText.includes('暴風雨')) {
    conditions.push('heavyRain');
    icon = '⛈️';
  } else if (weatherText.includes('雨') || weatherText.includes('雷')) {
    conditions.push('rain');
    icon = '🌧️';
  }

  if (weatherText.includes('雪') || weatherText.includes('吹雪') || weatherText.includes('みぞれ')) {
    conditions.push('snow');
    icon = '❄️';
  }

  if (weatherText.includes('くもり') || weatherText.includes('曇')) {
    if (!conditions.length) icon = '☁️';
    if (!conditions.some(c => ['rain', 'heavyRain', 'snow'].includes(c))) {
      conditions.push('cloudy');
    }
  }

  // 風判定
  if (windText.includes('強') || windText.includes('非常に') || weatherText.includes('強風')) {
    conditions.push('wind');
  }

  // 気温判定
  const maxTemp = parseInt(tempMax);
  const minTemp = parseInt(tempMin);

  if (!isNaN(maxTemp)) {
    if (maxTemp >= 35) {
      conditions.push('hot');
      if (!conditions.some(c => ['rain', 'heavyRain', 'snow'].includes(c))) icon = '🔥';
    } else if (maxTemp >= 30) {
      conditions.push('warm');
    }
  }

  if (!isNaN(minTemp)) {
    if (minTemp <= 3) {
      conditions.push('cold');
      if (!conditions.some(c => ['rain', 'heavyRain', 'snow', 'hot', 'warm'].includes(c))) icon = '🥶';
    }
  }

  // 晴れ（他に何もなければ）
  if (conditions.length === 0) {
    if (weatherText.includes('晴')) {
      conditions.push('clear');
      icon = '☀️';
    } else {
      conditions.push('clear');
    }
  }

  return { icon, conditions, weatherText, tempMin, tempMax };
}

// --- カテゴリタブの初期化 ---
function initCategoryTabs() {
  const tabs = document.querySelectorAll('.category-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // タブの切り替え
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // カテゴリの表示切り替え
      const category = tab.dataset.category;
      document.querySelectorAll('.work-category').forEach(cat => {
        cat.classList.add('hidden');
      });
      document.getElementById(`category-${category}`).classList.remove('hidden');

      // 選択をリセット
      document.querySelectorAll('.work-btn').forEach(b => b.classList.remove('selected'));
      selectedWork = null;
      updateGenerateButton();
    });
  });
}

// --- 作業ボタンの初期化 ---
function initWorkButtons() {
  const buttons = document.querySelectorAll('.work-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 全カテゴリの選択を解除
      document.querySelectorAll('.work-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedWork = btn.dataset.work;
      updateGenerateButton();
    });
  });
}

// --- 生成ボタンの状態更新 ---
function updateGenerateButton() {
  const btn = document.getElementById('generateBtn');
  const note = document.getElementById('generateNote');

  if (currentWeather && selectedWork) {
    btn.disabled = false;
    note.textContent = '準備OK！ ボタンを押してKY活動シートを生成しよう';
  } else if (!currentWeather && !selectedWork) {
    note.textContent = '地域と作業内容を選択してください';
  } else if (!currentWeather) {
    note.textContent = '地域を選択してください';
  } else {
    note.textContent = '作業内容を選択してください';
  }
}

// --- 生成ボタンのクリック ---
function initGenerateButton() {
  document.getElementById('generateBtn').addEventListener('click', () => {
    if (!currentWeather || !selectedWork) return;
    generateKY();
  });
}

// --- KY活動シートを生成 ---
function generateKY() {
  const workData = WORK_DANGERS[selectedWork];
  if (!workData) return;

  const resultCard = document.getElementById('resultCard');
  resultCard.classList.remove('hidden');

  // 日付（選択された日付を使用）
  const selectedForecast = weeklyForecasts[selectedDateIndex];
  const targetDate = selectedForecast ? selectedForecast.date : new Date();
  const dateStr = `${targetDate.getFullYear()}/${targetDate.getMonth() + 1}/${targetDate.getDate()}`;
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  document.getElementById('resultDate').textContent = `📅 ${dateStr}（${dayNames[targetDate.getDay()]}）`;
  document.getElementById('resultRegion').textContent = `📍 ${selectedRegionName}`;
  document.getElementById('resultWeather').textContent =
    `${currentWeather.icon} ${currentWeather.weatherText.substring(0, 15)}`;

  // 天気アラート
  const alertEl = document.getElementById('weatherAlert');
  alertEl.classList.add('hidden');
  for (const condition of currentWeather.conditions) {
    const riskData = WEATHER_RISKS[condition];
    if (riskData && riskData.alert) {
      alertEl.classList.remove('hidden');
      alertEl.className = `weather-alert level-${riskData.alert.level}`;
      document.getElementById('alertTitle').textContent = riskData.alert.title;
      document.getElementById('alertText').textContent = riskData.alert.text;
      break;
    }
  }

  // 作業の危険ポイント（ランダムに3〜4個選択）
  const dangerList = document.getElementById('dangerList');
  dangerList.innerHTML = '';
  const selectedDangers = shuffleAndPick(workData.dangers, Math.min(4, workData.dangers.length));
  selectedDangers.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    dangerList.appendChild(li);
  });

  // 天気起因のリスク
  const weatherRiskList = document.getElementById('weatherRiskList');
  weatherRiskList.innerHTML = '';
  const allWeatherRisks = [];
  currentWeather.conditions.forEach(condition => {
    const riskData = WEATHER_RISKS[condition];
    if (riskData) {
      allWeatherRisks.push(...riskData.risks);
    }
  });
  const selectedWeatherRisks = shuffleAndPick(allWeatherRisks, Math.min(4, allWeatherRisks.length));
  selectedWeatherRisks.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    weatherRiskList.appendChild(li);
  });

  // 対策
  const actionList = document.getElementById('actionList');
  actionList.innerHTML = '';
  const allActions = [...workData.actions];
  currentWeather.conditions.forEach(condition => {
    const riskData = WEATHER_RISKS[condition];
    if (riskData) {
      allActions.push(...riskData.actions);
    }
  });
  const selectedActions = shuffleAndPick(allActions, Math.min(5, allActions.length));
  selectedActions.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    actionList.appendChild(li);
  });

  // 安全目標
  const goalText = document.getElementById('goalText');
  let goalPool = [...SAFETY_GOALS.default];
  currentWeather.conditions.forEach(condition => {
    if (SAFETY_GOALS[condition]) {
      goalPool = [...SAFETY_GOALS[condition], ...goalPool];
    }
  });
  goalText.textContent = goalPool[Math.floor(Math.random() * goalPool.length)];

  // スクロール
  setTimeout(() => {
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// --- ユーティリティ：配列からランダムに指定数を抽出 ---
function shuffleAndPick(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// --- アクションボタン ---
function initActionButtons() {
  // コピーボタン
  document.getElementById('copyBtn').addEventListener('click', () => {
    const text = generateCopyText();
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copyBtn');
      btn.textContent = '✅ コピーしました！';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = '📋 テキストコピー';
        btn.classList.remove('copied');
      }, 2000);
    });
  });

  // リセットボタン
  document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('resultCard').classList.add('hidden');
    generateKY();
    setTimeout(() => {
      document.getElementById('resultCard').classList.remove('hidden');
    }, 100);
  });
}

// --- コピー用テキスト生成 ---
function generateCopyText() {
  const now = new Date();
  const dateStr = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
  const workData = WORK_DANGERS[selectedWork];

  let text = `【本日のKY活動シート】\n`;
  text += `日付: ${dateStr}\n`;
  text += `地域: ${selectedRegionName}\n`;
  text += `天気: ${currentWeather.weatherText}\n`;
  text += `作業: ${workData.name}\n\n`;

  text += `■ 作業に潜む危険ポイント\n`;
  document.querySelectorAll('#dangerList li').forEach((li, i) => {
    text += `${i + 1}. ${li.textContent}\n`;
  });

  text += `\n■ 天気に起因するリスク\n`;
  document.querySelectorAll('#weatherRiskList li').forEach((li, i) => {
    text += `${i + 1}. ${li.textContent}\n`;
  });

  text += `\n■ 本日の重点対策\n`;
  document.querySelectorAll('#actionList li').forEach((li, i) => {
    text += `${i + 1}. ${li.textContent}\n`;
  });

  text += `\n🎯 本日の安全目標\n`;
  text += document.getElementById('goalText').textContent;

  return text;
}
