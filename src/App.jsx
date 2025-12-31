import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Play, 
  RotateCcw, 
  BookOpen, 
  CheckSquare, 
  ArrowRight,
  List,
  Trophy
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

// --- データ定義 (全14問: 2-2 簿記の基礎知識) ---

const problemData = [
  {
    id: 1,
    category: "有価証券",
    question: "有価証券の期末評価に関する記述として、最も適切なものはどれか。なお、有価証券の時価は著しく下落していないものとする。",
    options: [
      "子会社株式および関連会社株式は、取得原価をもって貸借対照表価額とする。",
      "その他有価証券は、時価をもって貸借対照表価額とし、評価差額は当期の損益として処理する。",
      "売買目的有価証券は、時価をもって貸借対照表価額とし、評価差額は貸借対照表の純資産の部に直接計上する。",
      "満期保有目的の債券を額面金額と異なる価額で取得した場合、取得価額と債券の額面金額との差額の性格が金利の調整と認められるときは、額面金額をもって貸借対照表価額とする。"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2">有価証券は保有目的によって評価方法が異なります。</p>
      
      <div class="my-4 overflow-x-auto border rounded-lg">
        <table class="min-w-full text-sm text-left">
          <thead class="bg-blue-50">
            <tr>
              <th class="p-2 border">区分</th>
              <th class="p-2 border">評価基準</th>
              <th class="p-2 border">評価差額の処理</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-2 border font-bold">売買目的有価証券</td>
              <td class="p-2 border">時価</td>
              <td class="p-2 border">当期の損益 (P/L)</td>
            </tr>
            <tr>
              <td class="p-2 border font-bold">満期保有目的の債券</td>
              <td class="p-2 border">取得原価 (償却原価)</td>
              <td class="p-2 border">-</td>
            </tr>
            <tr>
              <td class="p-2 border font-bold text-red-600">子会社・関連会社株式</td>
              <td class="p-2 border text-red-600">取得原価</td>
              <td class="p-2 border">-</td>
            </tr>
            <tr>
              <td class="p-2 border font-bold">その他有価証券</td>
              <td class="p-2 border">時価</td>
              <td class="p-2 border">純資産直入 (B/S)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="mb-2 text-red-600"><strong>ア ○：</strong> 子会社・関連会社株式は、事業支配等を目的とするため時価評価せず、取得原価で評価します。</p>
      <p class="mb-2"><strong>イ ×：</strong> その他有価証券の評価差額は「純資産」に計上します（全部純資産直入法）。</p>
      <p class="mb-2"><strong>ウ ×：</strong> 売買目的有価証券の評価差額は「当期の損益」として処理します。</p>
      <p class="mb-2"><strong>エ ×：</strong> 金利調整と認められる場合は「償却原価法」を適用します。額面金額ではありません。</p>
    `
  },
  {
    id: 2,
    category: "経過勘定",
    question: "20X2年1月1日に300,000千円を期間6カ月、年利5％で取引先Ｚ社に貸し付けた。20X2年6月30日に利息と元金を合わせて受け取る予定である。会計期間は20X2年3月31日までの1年間である。決算にあたり計上される未収利息の金額として、最も適切なものはどれか。",
    options: [
      "3,750千円",
      "7,500千円",
      "15,000千円",
      "30,000千円"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2">当期（1月1日〜3月31日）に属する3ヶ月分の利息を月割り計算し、未収計上します。</p>
      <div class="bg-gray-100 p-3 rounded mb-2">
        <p><strong>計算式：</strong></p>
        <p>元本 300,000千円 × 年利 5% × (3ヶ月 / 12ヶ月)</p>
        <p>= 15,000 × 0.25</p>
        <p class="text-xl font-bold text-blue-600 mt-2">= 3,750千円</p>
      </div>
      <p class="text-sm text-gray-600">※全期間（6ヶ月）の利息は7,500千円ですが、そのうち当期分は半分です。</p>
    `
  },
  {
    id: 3,
    category: "売上原価の算定",
    question: "以下の資料に基づいて、今期の売上原価として最も適切なものを下記の解答群から選べ。\n\n【資　料】\n期首商品棚卸高：120,000 円\n当期商品純仕入高：650,000 円\n期末帳簿棚卸数量：1,300 個（原価＠100円）\n期末実地棚卸数量：1,000 個\n※棚卸減耗損は売上原価とする。",
    options: [
      "610,000 円",
      "640,000 円",
      "670,000 円",
      "700,000 円"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <div class="space-y-2">
        <div class="border p-2 rounded bg-white">
          <p class="font-bold border-b mb-1">① 期末商品棚卸高（帳簿）</p>
          <p>1,300個 × 100円 = 130,000円</p>
        </div>
        <div class="border p-2 rounded bg-white">
          <p class="font-bold border-b mb-1">② 棚卸減耗損</p>
          <p>(帳簿1,300 - 実地1,000) × 100円 = 300個 × 100円 = 30,000円</p>
          <p class="text-xs text-red-500">※問題文より「売上原価に含める」</p>
        </div>
        <div class="border p-2 rounded bg-blue-50">
          <p class="font-bold border-b mb-1">③ 売上原価の計算</p>
          <p>期首(120,000) + 当期仕入(650,000) - 期末帳簿(130,000) + 減耗損(30,000)</p>
          <p class="text-right font-bold text-lg text-blue-700">= 670,000円</p>
        </div>
        <p class="text-sm text-gray-500 mt-1">別解：期首 + 仕入 - 実地棚卸(100,000) = 670,000円 と計算しても同じです。</p>
      </div>
    `
  },
  {
    id: 4,
    category: "準備金積立",
    question: "株主総会の決議により、その他資本剰余金を取り崩して600,000円配当することにした。なお、資本金は4,000,000円、準備金の合計は950,000円である。このとき積み立てるべき準備金の種類と金額の組み合わせとして、最も適切なものはどれか。",
    options: [
      "種類：資本準備金　金額：50,000 円",
      "種類：資本準備金　金額：60,000 円",
      "種類：利益準備金　金額：50,000 円",
      "種類：利益準備金　金額：60,000 円"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <ul class="list-disc pl-5 space-y-1 mb-2">
        <li><strong>準備金の種類：</strong> 原資が「その他資本剰余金」なので、積み立てるのは<strong>「資本準備金」</strong>です。</li>
        <li><strong>原則額：</strong> 配当額(60万) × 1/10 = 60,000円</li>
        <li><strong>限度額（1/4規定）：</strong> (資本金(400万) × 1/4) - 準備金合計(95万) = 100万 - 95万 = <strong>50,000円</strong></li>
      </ul>
      <p class="mb-2">原則額(6万)と限度額(5万)の<strong>小さい方</strong>を積み立てます。</p>
      <p class="font-bold text-blue-600">答え：資本準備金、50,000円</p>
    `
  },
  {
    id: 5,
    category: "固定資産除却",
    question: "備品(取得日:2018年4月1日、取得原価:800,000円、償却方法:定率法(償却率年25%)、記帳方法:間接法、決算日:3月31日)が不要となり、2020年3月31日に除却した。\nなお、除却した備品の評価額は250,000円である。\n固定資産除却損として、最も適切なものはどれか。",
    options: [
      "100,000円",
      "150,000円",
      "200,000円",
      "250,000円"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="mb-2">2年経過後の簿価を計算し、評価額との差額を求めます。</p>
      <div class="space-y-2 text-sm">
        <div class="bg-white p-2 border rounded">
          <p><strong>1年目 (2018/4 - 2019/3):</strong></p>
          <p>800,000 × 25% = 200,000 (減価償却費)</p>
          <p>簿価: 600,000</p>
        </div>
        <div class="bg-white p-2 border rounded">
          <p><strong>2年目 (2019/4 - 2020/3):</strong></p>
          <p>600,000 × 25% = 150,000 (減価償却費)</p>
          <p>簿価: 450,000</p>
        </div>
        <div class="bg-blue-50 p-2 border rounded">
          <p><strong>除却損益:</strong></p>
          <p>評価額(250,000) - 簿価(450,000) = <strong>△200,000 (損)</strong></p>
        </div>
      </div>
    `
  },
  {
    id: 6,
    category: "無形固定資産の会計",
    question: "無形固定資産の会計に関する記述として、最も適切なものはどれか。",
    options: [
      "自社が長年にわたり築き上げたブランドにより、同業他社に比べ高い収益性を獲得している場合には、これを無形固定資産に計上することができる。",
      "自社の研究開発活動により特許権を取得した場合には、それまでの年度に支出された研究開発費を戻し入れ、無形固定資産として計上しなければならない。",
      "受注制作のソフトウェアの制作費は、請負工事の会計処理に準じて処理され、無形固定資産に計上されない。",
      "のれんとして資産計上された金額は、最長10年にわたり、規則的に償却される。"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="mb-2"><strong>ア ×：</strong> 自社創設の「のれん（ブランド価値）」は資産計上できません。有償取得したものに限ります。</p>
      <p class="mb-2"><strong>イ ×：</strong> 研究開発費は発生時に費用処理します。あとから資産に戻し入れることはしません。</p>
      <p class="mb-2 text-red-600"><strong>ウ ○：</strong> 受注制作ソフトは、販売先への「請負工事」のようなものなので、制作費は資産ではなく売上原価（または仕掛品）として扱われます。</p>
      <p class="mb-2"><strong>エ ×：</strong> のれんの償却期間は最長<strong>20年</strong>です。</p>
    `
  },
  {
    id: 7,
    category: "3伝票制",
    question: "商品120,000円を売り上げ、代金のうち30,000円を現金で受け取り、残額を掛けとした。この取引を入金伝票と振替伝票で処理する場合、振替伝票の仕訳として適切なものはどれか。\n(入金伝票には「[借]現金 30,000 / [貸]売掛金 30,000」と起票されているものとする)",
    options: [
      "[借] 売掛金 90,000 / [貸] 売上 90,000",
      "[借] 売掛金 120,000 / [貸] 売上 120,000",
      "[借] 現金 30,000 / [貸] 売上 120,000 (貸方に売掛金90,000)",
      "[借] 現金 90,000 / [貸] 売上 120,000 (貸方に売掛金30,000)"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      <p class="mb-2">一部現金取引における「総額法（一度全額を掛けにする方法）」の処理です。</p>
      <div class="border p-2 rounded mb-2 text-sm">
        <p class="font-bold text-gray-700">① 振替伝票（全額掛けにする）</p>
        <p class="pl-4 text-blue-600"><strong>(借) 売掛金 120,000 / (貸) 売上 120,000</strong></p>
        <p class="font-bold text-gray-700 mt-2">② 入金伝票（現金分を消し込む）</p>
        <p class="pl-4">(借) 現金 30,000 / (貸) 売掛金 30,000</p>
      </div>
      <p class="text-sm">これらを合わせると、「現金3万、売掛金9万 / 売上12万」という正しい仕訳になります。</p>
    `
  },
  {
    id: 8,
    category: "ソフトウェア会計",
    question: "ソフトウェアの会計処理および開示に関する記述として、最も適切なものはどれか。",
    options: [
      "自社利用目的のソフトウェアのうち、将来の収益獲得または費用削減が確実であるものについては、機械装置等に組み込まれたものを除き、その取得に要した費用を無形固定資産として計上する。",
      "市場販売を目的とするソフトウェアの製品マスターが完成するまでに要した制作費は、最初に製品化されたときに無形固定資産として計上する。",
      "受注制作のソフトウェアは、その制作に要した費用を無形固定資産として計上する。",
      "無形固定資産として計上したソフトウェアは規則的な償却を行わず、価値の低下時に減損処理する。"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2 text-red-600"><strong>ア ○：</strong> 自社利用ソフトで、収益獲得等の確実性があるものは資産計上します。</p>
      <p class="mb-2"><strong>イ ×：</strong> 製品マスター完成までの費用は「研究開発費」として費用処理します。</p>
      <p class="mb-2"><strong>ウ ×：</strong> 受注制作ソフトは請負工事に準じるため、無形固定資産にはなりません。</p>
      <p class="mb-2"><strong>エ ×：</strong> ソフトウェアは利用可能期間（通常5年以内）で定額法などで規則的に償却します。</p>
    `
  },
  {
    id: 9,
    category: "損益計算",
    question: "決算（12月31日）にあたり、以下の取引に対し計上される収益・費用の金額はどれか。\n・4月20日：全10回のセミナー受講料500,000円を現金で受取。\n・5月30日：全10回分のテキスト作成費250,000円を現金で支出。\n・12月31日：全10回のうち6回が終了している。",
    options: [
      "収益：300,000円　費用：150,000円",
      "収益：300,000円　費用：250,000円",
      "収益：500,000円　費用：150,000円",
      "収益：500,000円　費用：250,000円"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2">発生主義・実現主義に基づき、<strong>実施した回数分（6回分）</strong>だけを計上します。</p>
      <div class="grid grid-cols-2 gap-4 text-center text-sm mb-2">
        <div class="border p-2 rounded bg-blue-50">
          <p class="font-bold">収益</p>
          <p>500,000 × (6/10)</p>
          <p class="font-bold text-lg text-blue-700">= 300,000</p>
        </div>
        <div class="border p-2 rounded bg-red-50">
          <p class="font-bold">費用</p>
          <p>250,000 × (6/10)</p>
          <p class="font-bold text-lg text-red-700">= 150,000</p>
        </div>
      </div>
      <p class="text-xs text-gray-500">残りの未実施分は、前受金・前払費用（または仮払金）として次期に繰り越します。</p>
    `
  },
  {
    id: 10,
    category: "剰余金の配当",
    question: "剰余金の配当と処分に関する記述として、最も適切なものはどれか。",
    options: [
      "株式会社は、1事業年度につき、中間配当と期末配当の最大2回の配当を行うことができる。",
      "株式会社は、資本剰余金を原資とする配当を行うことはできない。",
      "取締役会設置会社は、取締役会の決議によって中間配当を実施することができる旨を定款で定めることができる。",
      "役員賞与を支払う場合、その10分の1の額を利益準備金として積み立てなければならない。"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="mb-2"><strong>ア ×：</strong> 会社法では配当回数の制限はありません（臨時決算をすれば何度でも可能）。</p>
      <p class="mb-2"><strong>イ ×：</strong> 資本剰余金を原資とする配当も可能です。</p>
      <p class="mb-2 text-red-600"><strong>ウ ○：</strong> 取締役会設置会社は、定款の定めがあれば取締役会決議で中間配当ができます。</p>
      <p class="mb-2"><strong>エ ×：</strong> 役員賞与は費用の発生であり、準備金の積立規定（配当に伴う積立）の対象外です。</p>
    `
  },
  {
    id: 11,
    category: "収益認識基準",
    question: "8/12に商品B(25,000円)と商品C(35,000円)の販売契約を結び、商品Bのみ先に引き渡した。代金合計60,000円は両方引き渡し後に請求できる契約である。8/12の仕訳として適切なものはどれか。",
    options: [
      "(借)契約資産 25,000 / (貸)売上 25,000",
      "(借)契約資産 25,000 / (貸)契約負債 25,000",
      "(借)契約資産 60,000 / (貸)売上 60,000",
      "(借)契約資産 60,000 / (貸)売上 25,000 (貸方に契約負債35,000)"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2">商品Bを引き渡した時点で、Bの収益（売上）を認識します。</p>
      <p class="mb-2">ただし、代金請求権はまだ発生していない（Cを渡すまで請求できない）ため、「売掛金」ではなく<strong>「契約資産」</strong>を使います。</p>
      <div class="bg-gray-100 p-2 rounded text-center">
        <p class="font-mono font-bold">(借) 契約資産 25,000 / (貸) 売上 25,000</p>
      </div>
    `
  },
  {
    id: 12,
    category: "特殊商品販売",
    question: "収益認識のタイミングとして、最も適切なものはどれか。",
    options: [
      "委託販売において、商品を代理店に発送した時点",
      "割賦販売において、商品を引き渡した時点",
      "試用販売において、試用のために商品を発送した時点",
      "予約販売において、商品の販売前に予約を受けた時点"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      <p class="mb-2"><strong>ア ×：</strong> 委託販売は、受託者が商品を「販売した日」に収益認識します（積送時はNG）。</p>
      <p class="mb-2 text-red-600"><strong>イ ○：</strong> 割賦販売は、原則として商品引渡時に全額収益認識します（回収期限到来基準などは廃止）。</p>
      <p class="mb-2"><strong>ウ ×：</strong> 試用販売は、相手が「買取の意思表示」をした時点で収益認識します。</p>
      <p class="mb-2"><strong>エ ×：</strong> 予約販売は、商品を引き渡した時点で収益認識します（予約時は前受金）。</p>
    `
  },
  {
    id: 13,
    category: "収益認識の記述",
    question: "収益に関する記述として、最も適切なものはどれか。",
    options: [
      "検収基準は、契約の解消や返品リスクがない場合に採用される。",
      "出荷基準よりも収益認識のタイミングが早いのは、引渡基準である。",
      "長期請負工事については、工事進行基準を適用しなければならない。",
      "販売基準は実現主義に基づいている。"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <p class="mb-2"><strong>ア ×：</strong> 検収基準は、返品リスク等がある場合に、検収完了まで収益計上を待つ保守的な基準です。</p>
      <p class="mb-2"><strong>イ ×：</strong> 出荷 → 引渡(着荷) なので、引渡基準の方が遅いです。</p>
      <p class="mb-2"><strong>ウ ×：</strong> 成果の確実性が認められない場合は「工事完成基準（回収基準等）」となります。</p>
      <p class="mb-2 text-red-600"><strong>エ ○：</strong> 収益会計の基本原則です。費用＝発生主義、収益＝実現主義。</p>
    `
  },
  {
    id: 14,
    category: "減価償却費",
    question: "X1年4月1日取得、耐用年数10年、残存ゼロの定額法の機械がある。X5年4月1日(当期首)の簿価は216,000円だった。この機械の取得原価はいくらか。",
    options: [
      "216,000円",
      "237,600円",
      "360,000円",
      "432,000円"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="mb-2">X1年4月からX5年4月まで、丸4年経過しています。</p>
      <div class="bg-blue-50 p-3 rounded text-sm">
        <p>耐用年数10年のうち4年経過 <br/>→ <strong>残り6年分</strong>の価値が216,000円です。</p>
        <p class="mt-2 border-t border-gray-300 pt-2">
          1年あたりの償却費 = 216,000 ÷ 6 = 36,000円
        </p>
        <p>取得原価 (10年分) = 36,000 × 10 = <strong>360,000円</strong></p>
      </div>
    `
  }
];

// --- コンポーネント実装 ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); // 'menu', 'quiz', 'result'
  const [quizMode, setQuizMode] = useState('all'); // 'all', 'wrong', 'review'
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [userAnswers, setUserAnswers] = useState({}); // { problemId: { answerIndex, isCorrect, timestamp } }
  const [reviewFlags, setReviewFlags] = useState({}); // { problemId: boolean }
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // 初期ロード (localStorageキーを 'app_financial_2_2' に変更)
  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem('app_financial_2_2_answers')) || {};
    const savedReviews = JSON.parse(localStorage.getItem('app_financial_2_2_reviews')) || {};
    setUserAnswers(savedAnswers);
    setReviewFlags(savedReviews);
  }, []);

  // 保存
  useEffect(() => {
    localStorage.setItem('app_financial_2_2_answers', JSON.stringify(userAnswers));
    localStorage.setItem('app_financial_2_2_reviews', JSON.stringify(reviewFlags));
  }, [userAnswers, reviewFlags]);

  // 問題セットアップ
  const startQuiz = (mode) => {
    let targets = [];
    if (mode === 'all') {
      targets = problemData;
    } else if (mode === 'wrong') {
      targets = problemData.filter(p => {
        const hist = userAnswers[p.id];
        return hist && !hist.isCorrect;
      });
    } else if (mode === 'review') {
      targets = problemData.filter(p => reviewFlags[p.id]);
    }

    if (targets.length === 0) {
      alert("対象となる問題がありません。");
      return;
    }

    setQuizMode(mode);
    setFilteredProblems(targets);
    setCurrentProblemIndex(0);
    setShowExplanation(false);
    setSelectedOption(null);
    setCurrentScreen('quiz');
  };

  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    const problem = filteredProblems[currentProblemIndex];
    const isCorrect = optionIndex === problem.correctAnswer;
    
    // 記録更新
    setUserAnswers(prev => ({
      ...prev,
      [problem.id]: {
        answerIndex: optionIndex,
        isCorrect: isCorrect,
        timestamp: new Date().toISOString()
      }
    }));
    
    setShowExplanation(true);
  };

  const nextProblem = () => {
    if (currentProblemIndex < filteredProblems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      setCurrentScreen('result');
    }
  };

  const toggleReview = (problemId) => {
    setReviewFlags(prev => {
      const newVal = !prev[problemId];
      return { ...prev, [problemId]: newVal };
    });
  };

  // 集計
  const stats = useMemo(() => {
    const total = problemData.length;
    const answeredCount = Object.keys(userAnswers).length;
    const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const reviewCount = Object.values(reviewFlags).filter(Boolean).length;
    return { total, answeredCount, correctCount, reviewCount };
  }, [userAnswers, reviewFlags]);

  // --- 画面レンダリング ---

  if (currentScreen === 'menu') {
    const pieData = [
      { name: '正解', value: stats.correctCount, color: '#4ade80' },
      { name: '不正解/未回答', value: stats.total - stats.correctCount, color: '#f87171' },
    ];

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 p-4 font-sans">
        <div className="max-w-xl mx-auto space-y-6">
          <header className="text-center py-6">
            <h1 className="text-2xl font-bold text-slate-700">簿記の基礎知識 2-2</h1>
            <p className="text-slate-500 text-sm mt-1">過去問セレクト演習</p>
          </header>

          {/* ダッシュボード */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4 w-full flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> 学習状況
            </h2>
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-8 text-center mt-2 w-full">
              <div>
                <p className="text-2xl font-bold text-green-500">{stats.correctCount}<span className="text-sm text-gray-400">/{stats.total}</span></p>
                <p className="text-xs text-gray-500">正解数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-500">{stats.reviewCount}</p>
                <p className="text-xs text-gray-500">要復習</p>
              </div>
            </div>
          </div>

          {/* モード選択 */}
          <div className="grid gap-3">
            <button 
              onClick={() => startQuiz('all')}
              className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition active:scale-95"
            >
              <div className="flex items-center gap-3">
                <Play className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">全ての問題を解く</div>
                  <div className="text-xs opacity-90">全{problemData.length}問</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => startQuiz('wrong')}
                className="flex flex-col items-center justify-center p-4 bg-white border-2 border-red-100 text-red-600 rounded-xl hover:bg-red-50 transition active:scale-95"
              >
                <RotateCcw className="w-6 h-6 mb-2" />
                <span className="font-bold text-sm">前回 × のみ</span>
              </button>
              <button 
                onClick={() => startQuiz('review')}
                className="flex flex-col items-center justify-center p-4 bg-white border-2 border-orange-100 text-orange-600 rounded-xl hover:bg-orange-50 transition active:scale-95"
              >
                <CheckSquare className="w-6 h-6 mb-2" />
                <span className="font-bold text-sm">要復習のみ</span>
              </button>
            </div>
          </div>

          {/* 問題一覧リスト */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b flex items-center gap-2">
              <List className="w-4 h-4 text-slate-500" />
              <h3 className="font-semibold text-slate-700 text-sm">問題一覧</h3>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y">
              {problemData.map((p, idx) => {
                const hist = userAnswers[p.id];
                const isReview = reviewFlags[p.id];
                return (
                  <div key={p.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500 font-mono">
                        {p.id}
                      </span>
                      <span className="truncate max-w-[200px] text-slate-600">
                        {p.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isReview && <AlertCircle className="w-4 h-4 text-orange-400" />}
                      {hist ? (
                        hist.isCorrect ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'quiz') {
    const problem = filteredProblems[currentProblemIndex];
    const isLast = currentProblemIndex === filteredProblems.length - 1;
    const progress = ((currentProblemIndex + 1) / filteredProblems.length) * 100;

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white shadow-sm z-10">
          <div className="h-1 bg-gray-200 w-full">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
            <button onClick={() => setCurrentScreen('menu')} className="text-sm text-gray-500 hover:text-gray-800">中断する</button>
            <span className="font-bold text-slate-700">Q. {currentProblemIndex + 1} / {filteredProblems.length}</span>
            <span className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-full">{problem.category}</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {/* 問題文 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-lg font-medium leading-relaxed whitespace-pre-wrap">{problem.question}</p>
          </div>

          {/* 選択肢 */}
          <div className="grid gap-3">
            {problem.options.map((opt, idx) => {
              let btnClass = "p-4 text-left rounded-xl border-2 transition-all ";
              if (showExplanation) {
                if (idx === problem.correctAnswer) {
                  btnClass += "bg-green-50 border-green-500 text-green-800";
                } else if (idx === selectedOption) {
                  btnClass += "bg-red-50 border-red-500 text-red-800";
                } else {
                  btnClass += "bg-white border-transparent shadow-sm opacity-50";
                }
              } else {
                btnClass += "bg-white border-transparent shadow-sm hover:border-blue-200 active:scale-[0.99]";
              }

              return (
                <button 
                  key={idx}
                  disabled={showExplanation}
                  onClick={() => handleAnswer(idx)}
                  className={btnClass}
                >
                  <div className="flex gap-3">
                    <span className="font-bold font-mono text-gray-400">{['ア','イ','ウ','エ'][idx]}</span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 解説エリア */}
          {showExplanation && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className={`p-4 rounded-xl mb-4 text-center font-bold text-white shadow-md ${selectedOption === problem.correctAnswer ? 'bg-green-500' : 'bg-red-500'}`}>
                {selectedOption === problem.correctAnswer ? '正解！' : '不正解...'}
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm text-slate-800">
                <div className="flex items-center gap-2 mb-3 text-blue-800 font-bold border-b border-blue-200 pb-2">
                  <BookOpen className="w-5 h-5" /> 解説
                </div>
                <div 
                  className="text-sm leading-relaxed explanation-content"
                  dangerouslySetInnerHTML={{ __html: problem.explanation }} 
                />
              </div>

              {/* 復習チェック */}
              <label className="flex items-center gap-3 p-4 bg-white mt-4 rounded-xl shadow-sm border border-orange-100 cursor-pointer hover:bg-orange-50 transition">
                <input 
                  type="checkbox" 
                  checked={!!reviewFlags[problem.id]} 
                  onChange={() => toggleReview(problem.id)}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="font-bold text-slate-700">あとで復習する（チェック）</span>
              </label>

              {/* 次へボタン */}
              <button 
                onClick={nextProblem}
                className="w-full mt-6 py-4 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-900 transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isLast ? '結果を見る' : '次の問題へ'} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentScreen === 'result') {
    const sessionCorrect = filteredProblems.filter(p => {
       const h = userAnswers[p.id];
       return h && h.isCorrect;
    }).length;
    
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-slate-800">お疲れ様でした！</h2>
            <p className="text-slate-500 mt-2">今回の正解率</p>
            <div className="text-5xl font-black text-blue-600 mt-2">
              {Math.round((sessionCorrect / filteredProblems.length) * 100)}%
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {sessionCorrect} / {filteredProblems.length} 問正解
            </p>
          </div>

          <button 
            onClick={() => setCurrentScreen('menu')}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow hover:bg-blue-700 transition"
          >
            メニューに戻る
          </button>
        </div>
      </div>
    );
  }

  return null;
}