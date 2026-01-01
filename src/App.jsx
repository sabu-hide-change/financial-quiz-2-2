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

// --- データ定義 (全26問: スマート問題集2-2 簿記の基礎知識) ---

const problemData = [
  {
    id: 1,
    category: "簿記上の取引",
    question: "簿記上の取引に関する説明として、最も不適切なものはどれか。",
    options: [
      "商品を注文することは「簿記上の取引」となる。",
      "商品を納品することは「簿記上の取引」となる。",
      "火災が発生して商品が焼失した場合は「簿記上の取引」となる。",
      "商品が盗難にあった場合は「簿記上の取引」となる。"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2">簿記上の「取引」とは、資産・負債・純資産・収益・費用のいずれかに増減変化をもたらす事象を指します。</p>
      <p class="mb-2 text-red-600"><strong>ア ×：</strong> 商品を「注文」しただけでは、まだ商品の引渡しや代金の支払いが起きていないため、資産などの増減はありません。よって「簿記上の取引」にはなりません。</p>
      <p class="mb-2"><strong>イ ○：</strong> 納品により商品の所有権が移転し、売掛金や売上が発生するため取引となります。</p>
      <p class="mb-2"><strong>ウ ○：</strong> 焼失により商品という資産が減少するため、取引となります。</p>
      <p class="mb-2"><strong>エ ○：</strong> 盗難により資産が減少するため、取引となります。</p>
    `
  },
  {
    id: 2,
    category: "仕訳",
    question: "仕訳に関する説明として、最も不適切なものはどれか。",
    options: [
      "簿記では、「資産」「負債」「純資産」「収益」「費用」の要素に分けて記入する。",
      "仕訳の左側が「借方」、仕訳の右側が「貸方」になり、「借方」と「貸方」の金額は必ず一致する。",
      "「資産の増加」「負債の減少」は、「借方」に記入される。",
      "「費用の増加」「収益の増加」は、「貸方」に記入される。"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <p class="mb-2"><strong>ア ○：</strong> 簿記の5要素についての正しい記述です。</p>
      <p class="mb-2"><strong>イ ○：</strong> 貸借平均の原理により、左右の金額は必ず一致します。</p>
      <p class="mb-2"><strong>ウ ○：</strong> 資産の増加と負債の減少は借方（左側）です。</p>
      <p class="mb-2 text-red-600"><strong>エ ×：</strong> 「収益の増加」は貸方（右側）ですが、<strong>「費用の増加」は借方（左側）</strong>に記入します。</p>
    `
  },
  {
    id: 3,
    category: "簿記一巡",
    question: "取引の発生から財務諸表の作成に至るまでの簿記一巡の手続きとして、最も適切なものはどれか。",
    options: [
      "取引の発生 → 仕訳 → 総勘定元帳転記 → 決算整理手続 → 試算表の作成 → 財務諸表の作成",
      "取引の発生 → 総勘定元帳転記 → 仕訳 → 試算表の作成 → 決算整理手続 → 財務諸表の作成",
      "取引の発生 → 仕訳 → 総勘定元帳転記 → 試算表の作成 → 決算整理手続 → 財務諸表の作成",
      "取引の発生 → 仕訳 → 試算表の作成 → 総勘定元帳転記 → 決算整理手続 → 財務諸表の作成"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="mb-2">簿記一巡の正しい順序は以下の通りです。</p>
      <ol class="list-decimal pl-5 space-y-1">
        <li>取引の発生</li>
        <li><strong>仕訳</strong>（仕訳帳へ記入）</li>
        <li><strong>総勘定元帳転記</strong></li>
        <li><strong>試算表の作成</strong>（決算整理前）</li>
        <li><strong>決算整理手続</strong></li>
        <li><strong>財務諸表の作成</strong></li>
      </ol>
    `
  },
  {
    id: 4,
    category: "商品売買に関する仕訳",
    question: "次の取引に関する仕訳として、最も適切なものを下記の解答群から選べ。\n\n【資料】\n（１）商品100,000円を仕入れ、代金は現金で支払った。\n（２）商品150,000円（原価100,000円）を売り渡し、代金は現金で受け取った。",
    options: [
      "（１）（借）仕入 100,000 （貸）現金 100,000\n（２）（借）現金 100,000 （貸）売上 100,000",
      "（１）（借）仕入 100,000 （貸）現金 100,000\n（２）（借）現金 150,000 （貸）売上 150,000",
      "（１）（借）現金 100,000 （貸）仕入 100,000\n（２）（借）売上 100,000 （貸）現金 100,000",
      "（１）（借）現金 100,000 （貸）仕入 100,000\n（２）（借）売上 150,000 （貸）現金 150,000"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      <p class="mb-2">（１）商品を現金で仕入れた場合、費用の発生（仕入）と資産の減少（現金）を記録します。</p>
      <p class="pl-4 text-blue-600 mb-2">（借）仕入 100,000 / （貸）現金 100,000</p>
      <p class="mb-2">（２）商品を現金で売り上げた場合、資産の増加（現金）と収益の発生（売上）を記録します。金額は<strong>売価</strong>の150,000円です。</p>
      <p class="pl-4 text-blue-600">（借）現金 150,000 / （貸）売上 150,000</p>
    `
  },
  {
    id: 5,
    category: "売掛金と買掛金",
    question: "次に示した仕訳から、取引内容として記述された（１）～（３）の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n【資料】\n（１）（借）売掛金 100,000 （貸）売　上 100,000\n（２）（借）現　金 100,000 （貸）売掛金 100,000\n（３）（借）買掛金 100,000 （貸）現　金 100,000",
    options: [
      "（１）商品を取引先へ100,000円で掛売上した。\n（２）取引先へ売掛金100,000円を現金で支払った。\n（３）仕入先へ買掛金100,000円を現金で支払った。",
      "（１）商品を100,000円で購入し、代金は掛けにした。\n（２）取引先へ売掛金100,000円を現金で支払った。\n（３）仕入先へ買掛金100,000円を現金で支払った。",
      "（１）商品を100,000円で購入し、代金は掛けにした。\n（２）取引先へ売掛金100,000円を現金で支払った。\n（３）仕入先から商品100,000円を掛けで仕入れた。",
      "（１）商品を取引先へ100,000円で掛売上した。\n（２）取引先より売掛金100,000円を現金で受け取った。\n（３）仕入先へ買掛金100,000円を現金で支払った。"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>（１）借：売掛金 / 貸：売上</strong><br>商品を掛けで売り上げた取引です。</li>
        <li><strong>（２）借：現金 / 貸：売掛金</strong><br>売掛金（資産）が減少し、現金が増えているため、売掛金を回収した取引です。</li>
        <li><strong>（３）借：買掛金 / 貸：現金</strong><br>買掛金（負債）が減少し、現金が減っているため、買掛金を支払った取引です。</li>
      </ul>
    `
  },
  {
    id: 6,
    category: "返品と値引",
    question: "次の資料に基づき、返品に関する記述として、最も適切なものはどれか。\n\n【資料】\n（１）（借）買掛金 500 （貸）仕　入 500\n（２）（借）売　上 500 （貸）売掛金 500",
    options: [
      "資料（１）は商品を仕入れた側が、仕入れた商品の内500円分を返品している。",
      "資料（２）は商品を仕入れた側が、仕入れた商品の内500円分を返品している。",
      "資料（１）は「売上戻り」のケースである。",
      "資料（２）は「仕入戻し」のケースである。"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2"><strong>ア ○：</strong> （１）は借方に買掛金（債務の減少）、貸方に仕入（費用の減少）があるため、「仕入戻し（返品）」の処理です。</p>
      <p class="mb-2"><strong>イ ×：</strong> （２）は借方に売上（収益の消滅）、貸方に売掛金（債権の減少）があるため、「売上戻り（返品）」の処理です（商品を販売した側の処理）。</p>
      <p class="mb-2"><strong>ウ ×：</strong> （１）は「仕入戻し」です。</p>
      <p class="mb-2"><strong>エ ×：</strong> （２）は「売上戻り」です。</p>
    `
  },
  {
    id: 7,
    category: "売上割引",
    question: "売掛金を期日よりも早期に回収した場合に、一定の金額を差し引いたり、返金したりすることを表す用語として、最も適切なものはどれか。",
    options: [
      "売上返品",
      "売上値引",
      "売上割戻",
      "売上割引"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <p class="mb-2 text-red-600"><strong>エ ○：</strong> 期日前の早期回収に対する利息相当額の免除は「売上割引」といいます（営業外費用）。</p>
      <p class="mb-2"><strong>ア ×：</strong> 商品が戻ってくることです。</p>
      <p class="mb-2"><strong>イ ×：</strong> 品質不良などで代金を減額することです。</p>
      <p class="mb-2"><strong>ウ ×：</strong> 多量購入などに対するリベートのことです。</p>
    `
  },
  {
    id: 8,
    category: "手形",
    question: "A社は、B社から受け取った、B社振り出しの約束手形1,000円を銀行へ持っていき、割引料100円で現金に割引いた。この取引の仕訳として、下記の解答群で最も適切なものはどれか。",
    options: [
      "（借）現金 900 （貸）受取手形 900",
      "（借）受取手形 900 （貸）現金 900",
      "（借）現金 900 （貸）受取手形 1,000\n（借）手形売却損 100",
      "（借）現金 900 （貸）受取手形 1,000\n　　　　　　 　（貸）手形売却損 100"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="mb-2">手形の割引時には、額面金額との差額（割引料）を「手形売却損」（費用）として処理します。</p>
      <div class="bg-gray-100 p-3 rounded">
        <p>（借）現金　900</p>
        <p>（借）手形売却損　100</p>
        <p class="pl-8">（貸）受取手形　1,000</p>
      </div>
    `
  },
  {
    id: 9,
    category: "売買目的有価証券",
    question: "次の取引に関する仕訳として、最も適切なものを下記の解答群から選べ。\n\n【資料】\n（１）Ａ社の株式を一株100円で100株分を購入し、代金は現金で支払った。\n（２）上記Ａ社株式50株を一株90円で売却し、代金は現金で受け取った。",
    options: [
      "（１）（借）売買目的有価証券 10,000 （貸）現金 10,000\n（２）（借）現金 4,500 （貸）売買目的有価証券 5,000\n　　　（借）有価証券売却損 500",
      "（１）（借）売買目的有価証券 10,000 （貸）現金 10,000\n（２）（借）現金 5,000 （貸）売買目的有価証券 5,000",
      "（１）（借）現金 10,000 （貸）売買目的有価証券 10,000\n（２）（借）現金 4,500 （貸）売買目的有価証券 5,000\n　　　（借）有価証券売却損 500",
      "（１）（借）売買目的有価証券 10,000 （貸）現金 10,000\n（２）（借）現金 4,500 （貸）売買目的有価証券 5,000\n　　　（借）有価証券売却益 500"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2"><strong>（１）購入時：</strong> 100円×100株＝10,000円（資産の増加）</p>
      <p class="mb-2"><strong>（２）売却時：</strong> 取得原価100円の株を90円で50株売却。<br>
      帳簿価額＝100円×50株＝5,000円<br>
      売却額＝90円×50株＝4,500円<br>
      差額＝500円の損失（有価証券売却損）</p>
      <div class="bg-gray-100 p-2 rounded text-sm">
        （借）現金 4,500<br>
        （借）有価証券売却損 500<br>
        　　（貸）売買目的有価証券 5,000
      </div>
    `
  },
  {
    id: 10,
    category: "有形固定資産",
    question: "次の取引に関する仕訳として、最も適切なものを下記の解答群から選べ。\n\n【資料】\n（１）建物1,000万円を現金で購入した。\n（２）建物購入時の手数料は100万円を現金で支払った。\n(単位：万円)",
    options: [
      "（借）建物 1,000 （貸）現金 1,000",
      "（借）現金 1,100 （貸）建物 1,100",
      "（借）現金 1,000 （貸）建物 1,000",
      "（借）建物 1,100 （貸）現金 1,100"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <p class="mb-2">固定資産の取得原価には、購入代金だけでなく、<strong>付随費用（手数料など）</strong>を含めます。</p>
      <p class="mb-2">取得原価 ＝ 1,000万円 ＋ 100万円 ＝ 1,100万円</p>
      <p class="pl-4 text-blue-600">（借）建物 1,100 / （貸）現金 1,100</p>
    `
  },
  {
    id: 11,
    category: "有形固定資産の売却",
    question: "20Ｘ1年1月1日に購入した建物（取得原価1,000,000千円、耐用年数20年、残存価額ゼロ）を20Ｘ2年6月30日に800,000千円で売却した。ただし、決算日は12月31日（年1回）であり、定額法により償却している。売却に当たり計上される減価償却費、固定資産売却損益の額として最も適切なものはどれか。",
    options: [
      "減価償却費　50,000千円　固定資産売却益　150,000千円",
      "減価償却費　50,000千円　固定資産売却損　150,000千円",
      "減価償却費　25,000千円　固定資産売却益　125,000千円",
      "減価償却費　25,000千円　固定資産売却損　125,000千円"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <p class="mb-2"><strong>① 当期の減価償却費（売却日まで）：</strong><br>
      20X2年1月1日～6月30日（6ヶ月）<br>
      1,000,000 ÷ 20年 × 6/12 ＝ <strong>25,000千円</strong></p>
      
      <p class="mb-2"><strong>② 売却時の帳簿価額：</strong><br>
      20X1年分（1年）＝ 50,000<br>
      累計額 ＝ 50,000 ＋ 25,000 ＝ 75,000<br>
      簿価 ＝ 1,000,000 － 75,000 ＝ 925,000千円</p>

      <p class="mb-2"><strong>③ 売却損益：</strong><br>
      売却額 800,000 － 簿価 925,000 ＝ <strong>△125,000（売却損）</strong></p>
    `
  },
  {
    id: 12,
    category: "社債",
    question: "社債発行に関する仕訳の説明として、空欄Ａ～Ｄに入る組み合わせとして、最も適切なものはどれか。\n\n社債を発行したときの仕訳は、（　Ａ　）を記入する。社債を発行した会社は、定期的に利息を払う必要がある。この時の仕訳は、借方に（　Ｂ　）を記入する。\n社債を社債金額よりも低い価額で発行することを（　Ｃ　）という。（　Ｃ　）では、取得価額と額面金額が異なる。よって差額を償還期までに毎期、一定の方法で調整する評価方法に（　Ｄ　）がある。",
    options: [
      "Ａ：借方に現金、貸方に社債　Ｂ：社債利息　Ｃ：割引発行　Ｄ：償却原価法",
      "Ａ：借方に現金、貸方に社債　Ｂ：支払利息　Ｃ：平価発行　Ｄ：償却原価法",
      "Ａ：借方に現金、貸方に社債　Ｂ：支払利息　Ｃ：平価発行　Ｄ：減価償却法",
      "Ａ：借方に社債、貸方に現金　Ｂ：社債利息　Ｃ：平価発行　Ｄ：売価還元法"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <ul class="list-disc pl-5">
        <li><strong>A:</strong> 社債発行時は現金を調達するので借方：現金、貸方：社債です。</li>
        <li><strong>B:</strong> 社債の利息は「社債利息」勘定を用います（支払利息ではありません）。</li>
        <li><strong>C:</strong> 額面より低く発行するのは「割引発行」です。</li>
        <li><strong>D:</strong> 差額を調整する方法は「償却原価法」です。</li>
      </ul>
    `
  },
  {
    id: 13,
    category: "株式の発行と剰余金の配当",
    question: "株式発行と剰余金の配当に関する説明として、空欄Ａ～Ｄに入る組み合わせとして、最も適切なものはどれか。\n\n株式を発行したときは、発行価額の総額を計算し、資本を計上する。しかし株式の発行価額の総額のＡの金額まで資本金に組み入れず、Ｂとして計上することも可能である。仕訳処理においては、資本金、ＢともにＣに記入する。また剰余金の配当をする場合には、配当する剰余金のＤの額をＢまたは「利益準備金」として計上しなければならない。",
    options: [
      "Ａ：4分の1　Ｂ：資本準備金　Ｃ：貸方　Ｄ：10分の1",
      "Ａ：2分の1　Ｂ：利益剰余金　Ｃ：借方　Ｄ：10分の1",
      "Ａ：2分の1　Ｂ：資本準備金　Ｃ：貸方　Ｄ：4分の1",
      "Ａ：2分の1　Ｂ：資本準備金　Ｃ：貸方　Ｄ：10分の1"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <ul class="list-disc pl-5">
        <li><strong>A: 2分の1</strong> (会社法規定により、払込額の1/2まで資本金にしないことができる)</li>
        <li><strong>B: 資本準備金</strong> (資本金にしなかった分)</li>
        <li><strong>C: 貸方</strong> (資本金も準備金も純資産の増加なので貸方)</li>
        <li><strong>D: 10分の1</strong> (配当額の1/10を積み立てる義務がある)</li>
      </ul>
    `
  },
  {
    id: 14,
    category: "決算手続",
    question: "決算整理に関する記述として、空欄Ａ～Ｄに入る組み合わせとして、最も適切なものはどれか。\n\n決算手続は試算表を使用する。試算表にはＡ、Ｂ、Ｃの3種類がある。Ａは、勘定ごとに、借方の合計金額と、貸方の合計金額を集計した表、Ｂは、勘定ごとに、借方と貸方の差額である残高を集計した表、Ｃは、合計試算表と、残高試算表を合わせたものである。決算整理前残高試算表を元にＤを行い、「決算整理後残高試算表」を作成する。",
    options: [
      "Ａ：合計試算表　Ｂ：残高試算表　Ｃ：合計残高試算表　Ｄ：決算整理仕訳",
      "Ａ：残高試算表　Ｂ：合計試算表　Ｃ：合計残高試算表　Ｄ：決算整理仕訳",
      "Ａ：合計試算表　Ｂ：残高試算表　Ｃ：合計残高試算表　Ｄ：転記",
      "Ａ：残高試算表　Ｂ：合計試算表　Ｃ：合計残高試算表　Ｄ：転記"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2"><strong>A: 合計試算表</strong>（合計金額を集計）</p>
      <p class="mb-2"><strong>B: 残高試算表</strong>（差額残高を集計）</p>
      <p class="mb-2"><strong>C: 合計残高試算表</strong>（両方合わせたもの）</p>
      <p class="mb-2"><strong>D: 決算整理仕訳</strong>（決算整理前T/Bから決算整理後T/Bへ進むための手続き）</p>
    `
  },
  {
    id: 15,
    category: "経過勘定",
    question: "次の経過勘定に関する決算時の仕訳として、最も適切なものを下記の解答群から選べ。\n\n【資料】\n(1)期中に家賃を120,000円払ったが、そのうち30,000円は次期の家賃である。\n(2)決算の時には、まだ利息を受け取っていないが、当期に計上すべき受取利息が150,000円ある。",
    options: [
      "(1) (借)支払家賃 30,000 (貸) 前払家賃 30,000\n(2) (借)未収利息 150,000 (貸) 受取利息 150,000",
      "(1) (借)前払家賃 30,000 (貸) 支払家賃 30,000\n(2) (借)受取利息 150,000 (貸) 未収利息 150,000",
      "(1) (借)前払家賃 30,000 (貸) 支払家賃 30,000\n(2) (借)未収利息 150,000 (貸) 受取利息 150,000",
      "(1) (借)支払家賃 30,000 (貸)前受家賃 30,000\n(2) (借)支払利息 150,000 (貸)未払利息 150,000"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="mb-2"><strong>(1) 前払費用の計上：</strong> 次期分30,000円を支払家賃から控除し、前払家賃（資産）にします。<br>（借）前払家賃 30,000 / （貸）支払家賃 30,000</p>
      <p class="mb-2"><strong>(2) 未収収益の計上：</strong> 当期分150,000円を受取利息（収益）に計上し、未収利息（資産）にします。<br>（借）未収利息 150,000 / （貸）受取利息 150,000</p>
    `
  },
  {
    id: 16,
    category: "棚卸資産の処理",
    question: "A社では、先入先出法により商品の払出単価を計算している。商品の仕入と売上に関する次の資料に基づいて、期末商品棚卸高として最も適切なものを下記の解答群から選べ。\n\n【資料】\n4/1 前期繰越 450個 (@200円)\n5/1 仕入 600個 (@196円)\n6/1 仕入 600個 (@192円)\n(売上: 7/20 750個, 8/20 600個)\n期末残高数量: 300個",
    options: [
      "61,800千円",
      "60,000千円",
      "58,800千円",
      "57,600千円"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <p class="mb-2">先入先出法（FIFO）では、古いものから売れていき、<strong>期末に残るのは「一番新しく仕入れたもの」</strong>です。</p>
      <p class="mb-2">期末数量は300個です。<br>
      最も新しい仕入は6/1の600個（@192円）ですので、残っている300個はすべてこの単価です。</p>
      <p class="pl-4 text-blue-600 font-bold">300個 × 192円 ＝ 57,600千円</p>
    `
  },
  {
    id: 17,
    category: "商品評価損と棚卸減耗費",
    question: "次の資料に基づき、商品評価損と棚卸減耗費を計算し、その金額の組み合わせとして最も適切なものを下記の解答群から選べ。\n\n【資料】\n帳簿数量: 100個\n実地棚卸数量: 95個\n原価: 100円\n時価: 90円",
    options: [
      "商品評価損　950　　棚卸減耗費　500",
      "商品評価損　500　　棚卸減耗費　950",
      "商品評価損　1,000　棚卸減耗費　475",
      "商品評価損　475　　棚卸減耗費　1,000"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <div class="space-y-2">
        <div class="border p-2 bg-blue-50">
          <p class="font-bold text-sm">棚卸減耗費（数量の減少）</p>
          <p>（帳簿100個 － 実地95個）× 原価100円 ＝ 5個 × 100円 ＝ <strong>500円</strong></p>
        </div>
        <div class="border p-2 bg-red-50">
          <p class="font-bold text-sm">商品評価損（単価の下落）</p>
          <p>（原価100円 － 時価90円）× 実地95個 ＝ 10円 × 95個 ＝ <strong>950円</strong></p>
        </div>
      </div>
    `
  },
  {
    id: 18,
    category: "貸倒引当金",
    question: "次の資料に基づき、貸倒引当金繰入額と貸倒引当金戻入益を計算し、その金額の組み合わせとして最も適切なものを下記の解答群から選べ。\n\n【資料】\n（１）売掛金勘定の当期の期末残高は2,000千円であった。\n（２）売掛金について、洗替法により10％の貸倒を見積もる。\n（３）貸倒引当金勘定の期末残高は、100千円であった。",
    options: [
      "貸倒引当金繰入額 100 貸倒引当金戻入益 　0",
      "貸倒引当金繰入額 100 貸倒引当金戻入益 200",
      "貸倒引当金繰入額 200 貸倒引当金戻入益 100",
      "貸倒引当金繰入額 200 貸倒引当金戻入益 　0"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="mb-2"><strong>洗替法</strong>では、まず前期の残高を全額戻し入れ（収益）、当期見積額を全額繰り入れ（費用）ます。</p>
      <p class="mb-2"><strong>① 戻入益：</strong> 前期残高 100千円を戻し入れる → <strong>100</strong></p>
      <p class="mb-2"><strong>② 繰入額：</strong> 当期見積額（2,000×10%＝200）を繰り入れる → <strong>200</strong></p>
    `
  },
  {
    id: 19,
    category: "有価証券の評価替",
    question: "次の資料に基づき、有価証券の評価替に関する仕訳として、最も適切なものを下記の解答群から選べ。\n\n【資料】\n（１）A社の株式を一株100円で100株分購入した。\n（２）上記、A社株式の期末時価は、一株110円であった。",
    options: [
      "（借）有価証券 1,000　（貸）有価証券評価益 1,000",
      "（借）有価証券評価益 1,000　（貸）有価証券 1,000",
      "（借）有価証券 1,000　（貸）有価証券評価損 1,000",
      "（借）有価証券評価損 1,000　（貸）有価証券 1,000"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2">取得原価：100円×100株＝10,000円<br>
      期末時価：110円×100株＝11,000円<br>
      差額：1,000円の<strong>評価益</strong>（資産の増加）</p>
      <p class="pl-4 text-blue-600">（借）有価証券 1,000 / （貸）有価証券評価益 1,000</p>
    `
  },
  {
    id: 20,
    category: "減価償却費",
    question: "次の資料に基づき、残存価額をゼロで有形固定資産の減価償却費を計算し、その金額の組み合わせとして最も適切なものを下記の解答群から選べ。\n\n【資料】\n建物：取得原価3,000万円、耐用年数30年（定額法）\n備品：取得原価1,000万円、期首累計額200万円、償却率20%（定率法）",
    options: [
      "建物減価償却費 100万円　備品減価償却費 160万円",
      "建物減価償却費 90万円　備品減価償却費 160万円",
      "建物減価償却費 100万円　備品減価償却費 200万円",
      "建物減価償却費 90万円　備品減価償却費 200万円"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2"><strong>建物（定額法）：</strong><br>
      3,000万円 ÷ 30年 ＝ <strong>100万円</strong></p>
      <p class="mb-2"><strong>備品（定率法）：</strong><br>
      （取得原価1,000 － 累計額200）× 20%<br>
      ＝ 800 × 0.2 ＝ <strong>160万円</strong></p>
    `
  },
  {
    id: 21,
    category: "引当金",
    question: "引当金に関する記述として、最も適切なものはどれか。",
    options: [
      "発生の可能性が低いが、将来の特定の費用又は損失であり、その発生が当期以前の事象に起因しており、その金額を合理的に見積ることができる場合は、引当金に計上しなければならない。",
      "その金額を合理的に見積ることができないが、将来の特定の費用又は損失であり、その発生が当期以前の事象に起因しており、発生の可能性が高い場合は、引当金に計上しなければならない。",
      "将来の特定の費用または損失であって、その発生が当期以前の事象に起因し、発生の可能性が高く、かつ、その金額を合理的に見積ることができる場合には、引当金を計上することができる。",
      "将来の特定の費用または損失であって、その発生が当期以前の事象に起因し、発生の可能性が高く、かつ、その金額を合理的に見積ることができる場合には、引当金を計上しなければならない（するものとする）。"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <p class="mb-2">引当金計上の4要件（①将来の特定費用・損失、②当期以前の事象に起因、③発生の可能性が高い、④金額を合理的に見積可能）を満たす場合は、計上が<strong>義務（しなければならない）</strong>となります。「できる（容認）」ではありません。</p>
    `
  },
  {
    id: 22,
    category: "負債性引当金",
    question: "負債性引当金は、債務である引当金(債務性引当金)と債務ではない引当金(非債務性引当金)に分類される。非債務性引当金として、最も適切なものはどれか。",
    options: [
      "修繕引当金",
      "賞与引当金",
      "貸倒引当金",
      "売上割戻引当金"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2 text-red-600"><strong>ア ○：</strong> 修繕引当金は、法的債務ではない（自社の資産の修繕のため）ため、「非債務性引当金」です。</p>
      <p class="mb-2"><strong>イ ×：</strong> 賞与引当金は、労働対価としての後払い債務の性質を持つため、債務性引当金です。</p>
      <p class="mb-2"><strong>ウ ×：</strong> 貸倒引当金は「評価性引当金」であり、負債性引当金ではありません。</p>
      <p class="mb-2"><strong>エ ×：</strong> 売上割戻引当金は、契約等に基づく債務性引当金です。</p>
    `
  },
  {
    id: 23,
    category: "現金過不足の処理",
    question: "現金過不足に関する次の資料に基づき、仕訳処理として、最も適切なものを下記の解答群から選べ。\n\n【資料】\n（１）帳簿有高が実際有高よりも500多かった。\n（２）期末において、上記原因が不明であったため、決算時に処理した。",
    options: [
      "（１）（借）現金 500 （貸）現金過不足 500\n（２）（借）現金過不足 500 （貸）雑益 500",
      "（１）（借）現金過不足 500 （貸）現金 500\n（２）（借）雑益 500 （貸）現金過不足 500",
      "（１）（借）現金 500 (貸）現金過不足 500\n（２）（借）雑損 500 (貸）現金過不足 500",
      "（１）（借）現金過不足 500 (貸）現金 500\n（２）（借）雑損 500 (貸）現金過不足 500"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <p class="mb-2">「帳簿が500多い」＝「実際が500足りない（不足）」です。</p>
      <p class="mb-2"><strong>（１）判明時：</strong> 帳簿を減らして実際に合わせます。<br>
      （借）現金過不足 500 / （貸）現金 500</p>
      <p class="mb-2"><strong>（２）決算時：</strong> 原因不明のため損失（雑損）にします。<br>
      （借）雑損 500 / （貸）現金過不足 500</p>
    `
  },
  {
    id: 24,
    category: "精算表",
    question: "次の精算表に基づき、空欄Ａ及び空欄Ｂに入る数値として、最も適切なものはどれか。\n\n＜資料＞\n・残高試算表：繰越商品 ( A )、仕入 1,200、売上 1,300、売掛金 300\n・修正記入：貸倒引当金 ( B )(貸方)、貸倒引当金繰入 ( B )(借方)\n・決算整理事項：\n（１）売上総利益は90（千円）であった。\n（２）売掛金の期末残高に対して5％の貸倒を見積る。（差額補充法。残高試算表の引当金残高は10）",
    options: [
      "（Ａ）200 （Ｂ） 5",
      "（Ａ）200 （Ｂ）15",
      "（Ａ）210 （Ｂ）10",
      "（Ａ）210 （Ｂ） 5"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2"><strong>空欄A（期首商品棚卸高）の計算：</strong><br>
      売上1,300 － 売上原価 ＝ 利益90 → 売上原価 ＝ 1,210<br>
      売上原価(1,210) ＝ 期首(A) ＋ 仕入(1,200) － 期末(190※貸借対照表欄より)<br>
      A ＝ 1,210 － 1,200 ＋ 190 ＝ <strong>200</strong></p>
      
      <p class="mb-2"><strong>空欄B（貸倒引当金繰入）の計算：</strong><br>
      売掛金300 × 5% ＝ 15（目標額）<br>
      残高10があるため、差額補充法で 15 － 10 ＝ <strong>5</strong> を繰り入れる。</p>
    `
  },
  {
    id: 25,
    category: "純損益の算出",
    question: "決算整理前残高試算表と決算整理事項から、当期の純損益を計算せよ。\n\n【試算表残高(一部)】\n売上 90,000, 仕入 65,000, 繰越商品 8,500, 給料 12,000, 支払家賃 5,000, 支払利息 2,000, 売掛金 35,000, 貸倒引当金 2,000\n\n【整理事項】\n1. 期末商品 5,000\n2. 売掛金に10%の引当金（差額補充法）\n3. 備品減価償却 900\n4. 家賃前払 500、利息未払 100",
    options: [
      "損失　500",
      "利益　500",
      "利益　1,400",
      "利益　2,900"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      <p class="mb-2"><strong>収益：</strong> 売上 90,000</p>
      <p class="mb-2"><strong>費用：</strong><br>
      ・売上原価：期首8,500＋仕入65,000－期末5,000 ＝ 68,500<br>
      ・給料：12,000<br>
      ・支払家賃：5,000－前払500 ＝ 4,500<br>
      ・支払利息：2,000＋未払100 ＝ 2,100<br>
      ・貸倒引当金繰入：(35,000×10%)－2,000 ＝ 1,500<br>
      ・減価償却費：900<br>
      費用合計：89,500</p>
      <p class="mb-2 font-bold text-blue-600">純利益：90,000 － 89,500 ＝ 500</p>
    `
  },
  {
    id: 26,
    category: "伝票会計",
    question: "3伝票制に関する説明として、最も適切なものはどれか。",
    options: [
      "3伝票制では、仕入伝票、売上伝票、振替伝票を用いる。",
      "入金伝票の科目欄には、貸方の勘定科目名と金額のみを記入する。",
      "出金伝票の科目欄には、貸方の勘定科目名と金額のみを記入する。",
      "振替伝票の科目欄には、貸方の勘定科目名と金額のみを記入する。"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      <p class="mb-2 text-red-600"><strong>イ ○：</strong> 入金伝票は「借方：現金」が決まっているため、記入するのは相手科目である<strong>「貸方科目」</strong>です。</p>
      <p class="mb-2"><strong>ア ×：</strong> 3伝票制は「入金・出金・振替」です。仕入・売上伝票を使うのは5伝票制です。</p>
      <p class="mb-2"><strong>ウ ×：</strong> 出金伝票は「貸方：現金」が決まっているため、記入するのは<strong>「借方科目」</strong>です。</p>
      <p class="mb-2"><strong>エ ×：</strong> 振替伝票は借方・貸方の両方の科目を記入します。</p>
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

  // 初期ロード (localStorageキーを 'app_smart_2_2' に設定)
  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem('app_smart_2_2_answers')) || {};
    const savedReviews = JSON.parse(localStorage.getItem('app_smart_2_2_reviews')) || {};
    setUserAnswers(savedAnswers);
    setReviewFlags(savedReviews);
  }, []);

  // 保存
  useEffect(() => {
    localStorage.setItem('app_smart_2_2_answers', JSON.stringify(userAnswers));
    localStorage.setItem('app_smart_2_2_reviews', JSON.stringify(reviewFlags));
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
            <h1 className="text-2xl font-bold text-slate-700">スマート問題集 2-2</h1>
            <p className="text-slate-500 text-sm mt-1">簿記の基礎知識</p>
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