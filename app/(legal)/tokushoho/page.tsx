import type { Metadata } from "next";

// intent: DEC-005 (Legal/legal-pages) — robots policy follows each page's publication purpose instead of a default.
// 判断: 特商法表記は検索流入可。事業者情報として公開される性質のドキュメント。
export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | otibo",
  description: "otibo の特定商取引法に基づく表記",
  robots: {
    index: true,
    follow: true,
  },
};

// 事業者情報は env で注入。ビルド時埋め込み。
// NF-003: 個人情報の実値はリポジトリに書かない。Cloudflare Pages の Variables で設定する。
const ownerName =
  process.env.OWNER_NAME ?? "【公開前に設定してください: OWNER_NAME】";
const ownerAddress =
  process.env.OWNER_ADDRESS ?? "【公開前に設定してください: OWNER_ADDRESS】";
const ownerPhone =
  process.env.OWNER_PHONE ?? "【公開前に設定してください: OWNER_PHONE】";

export default function TokushohoPage() {
  return (
    <>
      <h1>特定商取引法に基づく表記</h1>

      <h2>事業者情報</h2>

      <table>
        <tbody>
          <tr>
            <th>販売業者</th>
            <td>{ownerName}</td>
          </tr>
          <tr>
            <th>屋号</th>
            <td>otibo</td>
          </tr>
          <tr>
            <th>所在地</th>
            <td>{ownerAddress}</td>
          </tr>
          <tr>
            <th>電話番号</th>
            <td>{ownerPhone}</td>
          </tr>
          <tr>
            <th>メールアドレス</th>
            <td>
              <a href="mailto:contact@otibo.dev">contact@otibo.dev</a>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>販売価格</h2>

      <p>Medo Pro:</p>

      <ul>
        <li>月額プラン: 480 円(米国: $2.99)</li>
        <li>年額プラン: 3,000 円(米国: $14.99)</li>
      </ul>

      <p>
        その他の国・地域の価格は、各アプリ内の購入画面に表示されるストア価格をご確認ください。
      </p>

      <p>価格は税込です。</p>

      <h2>支払方法・支払時期</h2>

      <ul>
        <li>
          <strong>支払方法</strong>: Google Play
          に登録された決済方法(クレジットカード等)
        </li>
        <li>
          <strong>支払時期</strong>:
          購入時(サブスクリプションは各更新期間の開始時)
        </li>
      </ul>

      <p>
        決済は Google Play が処理します。詳細は Google Play
        のご利用規約をご確認ください。
      </p>

      <h2>役務の提供時期</h2>

      <p>購入完了後、速やかにアプリ内で Pro 機能をご利用いただけます。</p>

      <h2>返品・キャンセルについて</h2>

      <p>
        提供するサービスはアプリ内のデジタルコンテンツです。デジタルコンテンツの性質上、購入後の返品・返金は原則として対応しておりません。
      </p>

      <p>
        返金については、Google Play の返金ポリシーに従います。Google Play
        経由でのご購入に関する返金申請は Google Play
        の所定の手続きをご利用ください。
      </p>

      <p>
        サブスクリプションの解約は、Google Play
        のサブスクリプション管理画面でいつでも行えます。解約後の残存期間分の返金については
        Google Play の返金ポリシーをご確認ください。
      </p>

      <h2>お問い合わせ</h2>

      <p>
        本表記に関するお問い合わせは、
        <a href="mailto:contact@otibo.dev">contact@otibo.dev</a>{" "}
        までご連絡ください。
      </p>
    </>
  );
}
