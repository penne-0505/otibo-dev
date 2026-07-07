import { Button } from "@otibo/ui";
import type { Metadata } from "next";
import styles from "./account-deletion.module.css";

// intent: INV-005 (Legal/legal-pages) — noindex は明示的決定
// 判断: アカウント削除ページは検索流入可。Google Play データセーフティフォームで URL 提出が必要なページ。
// Google Play 削除要件 3 点: (1)エラーなく読み込まれる (2)削除リクエスト導線が目立つ位置に (3)アプリ名またはデベロッパー名が参照可能
export const metadata: Metadata = {
  title: "Medo アカウント削除 | otibo",
  description:
    "Android アプリ「Medo」のアカウント削除とデータ削除の手順を説明します。",
  robots: {
    index: true,
    follow: true,
  },
};

export default function MedoAccountDeletionPage() {
  return (
    <>
      <h1>Medo アカウント削除</h1>

      <p>
        このページでは、otibo が提供する Android アプリ「<strong>Medo</strong>
        」のアカウント削除とデータ削除の手順を説明します。
      </p>

      <hr />

      {/* Google Play 要件 (2): 削除リクエスト導線が目立つ位置に */}
      <div className={styles.requestPanel}>
        <p className={styles.requestTitle}>メールでアカウント削除を申請する</p>
        <p className={styles.requestDescription}>
          アプリにログインできない場合、またはアプリ内の削除機能を利用できない場合は、メールで削除を申請できます。
        </p>
        <Button
          render={
            <a href="mailto:contact@otibo.dev?subject=Medo%20アカウント削除申請" />
          }
        >
          削除申請メールを送る
        </Button>
      </div>

      <h2>アカウントを削除する</h2>

      <h3>方法 1: アプリ内から削除する(推奨)</h3>

      <p>Medo にログインできる場合は、以下の手順でアカウントを削除できます。</p>

      <ol>
        <li>タイムライン画面の上部にある設定ボタンから「設定」を開く</li>
        <li>「アカウント」セクションの「アカウントを削除」をタップ</li>
        <li>確認ダイアログで「削除」をタップ</li>
      </ol>

      <p>(「アカウントを削除」は、ログインしている場合にのみ表示されます。)</p>

      <p>削除を実行すると、以下のデータが削除されます。</p>

      <ul>
        <li>Supabase Auth 上のアカウント情報(メールアドレス・表示名等)</li>
        <li>Supabase 上の Pro 権限状態・課金イベント履歴</li>
        <li>
          端末内の予定データ・テンプレート・Pro
          キャッシュ・未送信アナリティクスキュー・通知予約
        </li>
      </ul>

      <p>
        <strong>削除後のデータは復元できません。</strong>
      </p>

      <h3>方法 2: メールで削除を申請する</h3>

      <p>
        アプリにログインできない場合、またはアプリ内の削除機能を利用できない場合は、メールで削除を申請してください。
      </p>

      <p>
        <strong>
          削除申請先:{" "}
          <a href="mailto:contact@otibo.dev?subject=Medo%20アカウント削除申請">
            contact@otibo.dev
          </a>
        </strong>
      </p>

      <p>申請の際は、以下の情報を記載してください。</p>

      <ul>
        <li>Medo でログインに使用した Google アカウントのメールアドレス</li>
        <li>
          削除を希望するデータの範囲(アカウント全体の削除 /
          特定データのみの削除)
        </li>
      </ul>

      <p>
        本人確認と対象アカウントの特定に必要な範囲で確認を行い、対応します。
      </p>

      <hr />

      <h2>アカウント削除の前に: サブスクリプションの解約</h2>

      <p>
        <strong>
          アカウントを削除しても、Google Play
          のサブスクリプションは自動的に解約されません。
        </strong>{" "}
        サブスクリプションが残っている場合は、先に以下の手順で解約してください。
      </p>

      <h3>Google Play でサブスクリプションを解約する手順</h3>

      <ol>
        <li>Google Play ストアアプリを開く</li>
        <li>画面右上のプロフィールアイコンをタップ</li>
        <li>「お支払いと定期購入」→「定期購入」を選択</li>
        <li>「Medo」を選択</li>
        <li>「定期購入を解約」をタップ</li>
      </ol>

      <p>
        解約後も、有効期限が残っている間は Pro
        機能を利用できます。有効期限が終わると、無料プランに移行します。
      </p>

      <hr />

      <h2>削除されるデータと削除されないデータ</h2>

      <table>
        <thead>
          <tr>
            <th>データ</th>
            <th>削除される?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Supabase Auth のアカウント情報(メールアドレス・表示名等)</td>
            <td>
              <strong>削除される</strong>
            </td>
          </tr>
          <tr>
            <td>
              Supabase 上の Pro 権限状態(<code>user_pro_entitlements</code>)
            </td>
            <td>
              <strong>削除される</strong>
            </td>
          </tr>
          <tr>
            <td>
              Supabase 上の課金イベント履歴・監査ログ(
              <code>pro_entitlement_events</code>)
            </td>
            <td>
              <strong>削除される</strong>
            </td>
          </tr>
          <tr>
            <td>
              端末内の予定データ・テンプレート・Pro
              キャッシュ等(アプリ内削除の場合)
            </td>
            <td>
              <strong>削除される</strong>
            </td>
          </tr>
          <tr>
            <td>
              未送信のアナリティクスキュー・インストール ID(アプリ内削除の場合)
            </td>
            <td>
              <strong>削除される</strong>
            </td>
          </tr>
          <tr>
            <td>送信済みのアナリティクスイベント</td>
            <td>残る(ユーザーと紐づけない形で保存されているため)</td>
          </tr>
          <tr>
            <td>RevenueCat 側の subscriber record</td>
            <td>残る(RevenueCat のポリシーに従って処理されます)</td>
          </tr>
          <tr>
            <td>Google Play 側のストア購入履歴</td>
            <td>残る(Google Play のポリシーに従って処理されます)</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>お問い合わせ</h2>

      <p>
        削除に関して不明な点がある場合や、保存データの確認・削除を希望する場合は、
        <a href="mailto:contact@otibo.dev">contact@otibo.dev</a>{" "}
        までお気軽にご連絡ください。
      </p>

      <p>
        プライバシーポリシーは{" "}
        <a href="/medo/privacy/">https://otibo.dev/medo/privacy/</a>{" "}
        をご覧ください。
      </p>

      <hr />

      {/* Google Play 要件 (3): アプリ名またはデベロッパー名が参照可能 */}
      <p>
        <strong>アプリ名</strong>: Medo
        <br />
        <strong>開発者</strong>: otibo
        <br />
        <strong>連絡先</strong>:{" "}
        <a href="mailto:contact@otibo.dev">contact@otibo.dev</a>
      </p>
    </>
  );
}
