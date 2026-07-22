import type { Metadata } from "next";

// intent: DEC-005 (Legal/legal-pages) — robots policy follows each page's publication purpose instead of a default.
// 判断: プライバシーポリシーは検索流入可。Google Play 審査でも参照される公開ページ。
export const metadata: Metadata = {
  title: "Medo プライバシーポリシー | otibo",
  description:
    "アプリケーション「Medo」における情報の取扱いについて説明します。",
  robots: {
    index: true,
    follow: true,
  },
};

// 事業者情報・施行日は env で注入。ビルド時埋め込み。
// NF-003: 個人情報の実値はリポジトリに書かない。
const ownerName =
  process.env.OWNER_NAME ?? "【公開前に設定してください: OWNER_NAME】";
const effectiveDate =
  process.env.EFFECTIVE_DATE ??
  "本ポリシーは Medo のストア公開日をもって発効します";

export default function MedoPrivacyPage() {
  return (
    <>
      <h1>Medo プライバシーポリシー</h1>

      <p>
        <strong>最終更新日:</strong> {effectiveDate}
      </p>

      <p>
        otibo(以下「当方」)は、アプリケーション「Medo」(以下「本アプリ」)における情報の取扱いを、本プライバシーポリシー(以下「本ポリシー」)で説明します。
      </p>

      <h2>1. 事業者情報</h2>

      <table>
        <tbody>
          <tr>
            <th>屋号</th>
            <td>otibo</td>
          </tr>
          <tr>
            <th>運営者氏名</th>
            <td>{ownerName}</td>
          </tr>
          <tr>
            <th>連絡先</th>
            <td>
              <a href="mailto:contact@otibo.dev">contact@otibo.dev</a>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>2. 本アプリが取得・保存する情報</h2>

      <h3>2-1. ユーザーが作成する予定データ(端末内保存)</h3>

      <p>
        Medo
        で作成したタイムライン、予定名、予定時刻、テンプレートなどの予定データは、原則としてお使いの端末内に保存されます。当方のサーバー(Supabase
        等)には、これらの予定内容を保存しません。
      </p>

      <p>
        アプリのアンインストール、端末の初期化、または端末内データの削除を行うと、端末内の予定データは失われる場合があります。
      </p>

      <h3>2-2. アカウント情報(Google ログイン利用時)</h3>

      <p>
        Google ログインを利用した場合、Pro
        機能の購入・復元・権限管理のために、Supabase Auth および Google OAuth
        を通じて以下の情報を取得・保存します。
      </p>

      <table>
        <thead>
          <tr>
            <th>情報</th>
            <th>取得元</th>
            <th>主な用途</th>
            <th>保存先</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Supabase ユーザー ID</td>
            <td>Supabase Auth</td>
            <td>Pro 権限の識別、RevenueCat App User ID として利用</td>
            <td>Supabase、RevenueCat</td>
          </tr>
          <tr>
            <td>メールアドレス</td>
            <td>Google アカウント</td>
            <td>
              ログイン、問い合わせ対応、審査用 temporary Pro allowlist の照合
            </td>
            <td>Supabase</td>
          </tr>
          <tr>
            <td>
              表示名・プロフィール画像 URL・Google 由来のプロフィールメタデータ
            </td>
            <td>Google アカウント</td>
            <td>ログイン中のアカウント識別、問い合わせ対応</td>
            <td>Supabase</td>
          </tr>
          <tr>
            <td>認証セッション情報</td>
            <td>Supabase Auth</td>
            <td>ログイン状態の維持</td>
            <td>端末、Supabase</td>
          </tr>
        </tbody>
      </table>

      <p>
        RevenueCat の App User ID には、Supabase 由来の非推測 UUID
        を使用します。RevenueCat
        にはメールアドレス、氏名、予定データ、自由入力内容を渡しません。
      </p>

      <p>
        無料のコア機能は、可能な限りログインなしで利用できるようにしています。
      </p>

      <h3>2-3. Pro 課金・権限管理に関する情報</h3>

      <p>
        Pro 機能の購入・復元・権限確認のために、RevenueCat、Google
        Play、Supabase を利用します。
      </p>

      <p>Supabase には以下を保存します。</p>

      <ul>
        <li>
          現在の Pro 権限状態(<code>user_pro_entitlements</code>)
        </li>
        <li>
          課金イベント履歴・監査ログ(<code>pro_entitlement_events</code>)
        </li>
        <li>
          審査または検証用の temporary Pro allowlist(
          <code>reviewer_entitlement_allowlist</code>)
        </li>
      </ul>

      <p>
        課金イベント履歴には、RevenueCat イベント ID・イベント種別・ストア・商品
        ID・購入/有効期限に関する時刻・取引 ID など、Pro
        権限の確認に必要な情報が含まれる場合があります。Google Play
        での購入・解約・返金・支払い方法などの決済処理は、Google Play
        側で管理されます。
      </p>

      <h3>2-4. 利用状況データ(アナリティクス)</h3>

      <p>
        当方は、アプリ改善と不具合把握のために、ユーザーが設定画面で明示的に有効化した場合のみ、最小限の利用状況データを収集することがあります。
        <strong>既定では無効です。同意なしにはデータを送信しません。</strong>
        有効化・無効化は、設定画面の「プライバシー」セクションにある「利用改善データを送信」スイッチからいつでも切り替えられます。
      </p>

      <p>
        収集する可能性があるイベントは、次のような操作の発生です:
        アプリの起動、タイムラインの作成・保存(初回作成を含む)、項目の追加・並べ替え、テンプレートの作成・適用、カレンダー登録の開始・完了、テキスト共有・画像共有の完了、Pro
        購入画面の表示、購入の開始・結果、アカウント削除の実行。
      </p>

      <p>
        これらのイベントに、予定名・予定本文・テンプレート名・予定の日時・移動先などの予定内容は含めません。イベントには、ランダムに生成されたインストール
        ID・セッション
        ID、アプリバージョン、プラットフォーム、件数区分や結果区分など必要最小限の情報のみを含みます。
        <strong>
          メールアドレスや Supabase ユーザー ID
          は含めません(ユーザーと紐づけません)。
        </strong>
      </p>

      <p>
        同意を撤回した場合、端末上の未送信キューおよびインストール ID
        が削除されます。
      </p>

      <h3>2-5. 問い合わせ・フィードバック</h3>

      <p>
        ユーザーがメールまたはアプリ内のフィードバック導線から任意で送信した場合、問い合わせ・フィードバックの本文、返信先、送信日時、対応に必要な情報を取得することがあります。これらは問い合わせ対応・不具合調査・サービス改善のために利用します。
      </p>

      <p>
        フィードバック送信時に予定内容が自動添付されることはありません。ただし、ユーザー自身が本文に入力した内容は送信されますので、送信前に内容をご確認ください。
      </p>

      <h3>2-6. 取得しない情報</h3>

      <p>当方は以下の情報を取得しません。</p>

      <ul>
        <li>広告 ID</li>
        <li>位置情報</li>
        <li>年齢・性別</li>
        <li>予定名・予定本文・テンプレート名などの予定内容</li>
        <li>予定の正確な日時・移動先・訪問先</li>
        <li>
          タイムライン・予定・テンプレートなどのユーザー作成データのクラウド保存
        </li>
      </ul>

      <p>
        Firebase Analytics、広告 SDK、クラッシュレポート SDK
        は使用していません。
      </p>

      <h2>3. 利用目的</h2>

      <p>取得した情報は、以下の目的で利用します。</p>

      <ul>
        <li>Google ログインによる認証およびセッション管理</li>
        <li>Pro 機能の購入・復元・利用資格の確認</li>
        <li>RevenueCat webhook に基づく Pro 権限状態の同期</li>
        <li>審査または検証用 temporary Pro 権限の付与・停止</li>
        <li>アプリの利用状況の把握・改善・不具合調査(同意した場合のみ)</li>
        <li>問い合わせ・フィードバックへの対応</li>
        <li>不正利用の防止、課金状態の監査</li>
        <li>法令または正当な要請への対応</li>
      </ul>

      <p>
        取得した情報をターゲティング広告に利用することはありません。個人情報を販売しません。
      </p>

      <h2>4. 第三者サービスの利用</h2>

      <p>
        当方は以下の第三者サービスを利用しており、必要な範囲で情報が各社のサーバーで処理される場合があります。各社のプライバシーポリシーもご確認ください。
      </p>

      <table>
        <thead>
          <tr>
            <th>サービス</th>
            <th>運営</th>
            <th>用途</th>
            <th>プライバシーポリシー</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Supabase</td>
            <td>Supabase, Inc.</td>
            <td>
              認証、Pro 権限状態・課金イベント履歴・審査用 allowlist の管理
            </td>
            <td>
              <a href="https://supabase.com/privacy">
                https://supabase.com/privacy
              </a>
            </td>
          </tr>
          <tr>
            <td>Google OAuth</td>
            <td>Google LLC</td>
            <td>Google ログインによる認証</td>
            <td>
              <a href="https://policies.google.com/privacy">
                https://policies.google.com/privacy
              </a>
            </td>
          </tr>
          <tr>
            <td>RevenueCat</td>
            <td>RevenueCat, Inc.</td>
            <td>サブスクリプション管理・購入検証・Pro 権限確認</td>
            <td>
              <a href="https://www.revenuecat.com/privacy">
                https://www.revenuecat.com/privacy
              </a>
            </td>
          </tr>
          <tr>
            <td>Google Play</td>
            <td>Google LLC</td>
            <td>アプリ配信・アプリ内課金・サブスクリプション管理</td>
            <td>
              <a href="https://policies.google.com/privacy">
                https://policies.google.com/privacy
              </a>
            </td>
          </tr>
          <tr>
            <td>Google Fonts</td>
            <td>Google LLC</td>
            <td>フォントの配信(通信が発生する可能性があります)</td>
            <td>
              <a href="https://policies.google.com/privacy">
                https://policies.google.com/privacy
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        <strong>Supabase について</strong>:
        タイムライン・予定・テンプレートなどのユーザー作成データを Supabase
        に保存しません。Supabase のサーバーリージョンについては、Supabase
        のプライバシーポリシーをご確認ください。
      </p>

      <p>
        <strong>RevenueCat について</strong>: RevenueCat SDK
        は、購入管理・不正防止・利用資格の確認に必要な範囲で、端末・インストール・購入・ストアに関する情報を処理する場合があります。Medo
        から RevenueCat
        にメールアドレス・氏名・予定データ・自由入力内容を渡すことはありません。
      </p>

      <p>
        <strong>Google Fonts について</strong>: アプリまたはウェブサイトにおいて
        Google Fonts を使用している場合、フォントファイルの取得時に Google
        のサーバーへの通信が発生する可能性があります。
      </p>

      <h2>5. アプリの権限について</h2>

      <p>本アプリは以下の権限を使用することがあります。</p>

      <ul>
        <li>
          <strong>カレンダー(読み書き)</strong>:
          予定をカレンダーアプリに登録する機能のために使用します。カレンダー情報を当方のサーバーに送信しません。
        </li>
        <li>
          <strong>通知</strong>: リマインダーや通知の送信のために使用します。
        </li>
        <li>
          <strong>起動時自動実行(RECEIVE_BOOT_COMPLETED)</strong>:
          端末の再起動後に、予約済みの通知(リマインダー)を復元するために使用します。
        </li>
      </ul>

      <p>位置情報・カメラ・マイクなどの権限は使用しません。</p>

      <h2>6. データの保存期間</h2>

      <table>
        <thead>
          <tr>
            <th>データ</th>
            <th>保存期間</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>端末内の予定データ</td>
            <td>
              ユーザーがアプリ内で削除するか、アンインストール・初期化するまで
            </td>
          </tr>
          <tr>
            <td>Supabase のアカウント情報</td>
            <td>アカウントが有効な期間中。アカウント削除時に削除</td>
          </tr>
          <tr>
            <td>Pro 権限状態・課金イベント履歴</td>
            <td>
              アカウントが有効な期間中。アカウント削除時に関連データも削除
            </td>
          </tr>
          <tr>
            <td>審査用 temporary Pro allowlist</td>
            <td>審査・検証に必要な期間のみ</td>
          </tr>
          <tr>
            <td>アナリティクスイベント(送信済み)</td>
            <td>アプリの改善・不具合調査に必要な期間保存します</td>
          </tr>
        </tbody>
      </table>

      <h2>7. アカウント削除・データ削除</h2>

      <p>
        本アプリの設定画面またはウェブ上の削除申請ページ(
        <a href="/medo/account-deletion/">
          https://otibo.dev/medo/account-deletion/
        </a>
        )からアカウント削除を申請できます。
      </p>

      <p>
        <strong>削除されるデータ(アカウント削除時)</strong>:
      </p>

      <ul>
        <li>Supabase Auth 上のアカウント情報(メールアドレス・表示名等)</li>
        <li>Supabase 上の Pro 権限状態・課金イベント履歴</li>
        <li>
          アプリ内で削除を実行した場合の端末内データ(予定データ・テンプレート・Pro
          キャッシュ・未送信アナリティクスキュー・通知予約等)
        </li>
      </ul>

      <p>
        <strong>削除されないもの</strong>:
      </p>

      <ul>
        <li>
          送信済みのアナリティクスイベント(ユーザーと紐づけない形で保存されているため)
        </li>
        <li>
          RevenueCat 側の subscriber record(RevenueCat
          のポリシーに従って処理されます)
        </li>
        <li>
          Google Play 側のストア購入履歴(Google Play
          のポリシーに従って処理されます)
        </li>
      </ul>

      <p>
        アカウント削除は、Google Play
        のサブスクリプション解約とは別の手続きです。サブスクリプションの解約・更新停止は、先に
        Google Play の管理画面で行ってください。
      </p>

      <p>
        詳細は
        <a href="/medo/account-deletion/">アカウント削除ページ</a>
        をご覧ください。
      </p>

      <h2>8. サブスクリプションの管理・解約</h2>

      <p>
        Pro サブスクリプションは Google Play
        の仕組みに従って管理されます。Android 版では、Google Play
        のサブスクリプション管理画面から解約・更新停止・支払い方法の変更を行ってください。購読を解約しても、有効期限が残っている間は
        Pro 機能を利用できる場合があります。
      </p>

      <h2>9. 国外サービスでの情報処理(海外移転)</h2>

      <p>
        Supabase、Google、RevenueCat
        などの第三者サービスは、日本国外を含む地域のサーバーで情報を処理する場合があります。当方は、これらのサービスを認証・課金管理・Pro
        権限確認など本アプリの提供に必要な範囲で利用します。
      </p>

      <p>
        Supabase
        が使用するサーバーリージョンはコードのみからは確定できないため、詳細は
        Supabase のプライバシーポリシーをご確認ください。
      </p>

      <h2>10. 開示・訂正・削除等のご請求</h2>

      <p>
        ご自身の個人情報について、アクセス・開示・訂正・削除・利用停止などを希望する場合は、以下の窓口にご連絡ください。本人確認を行ったうえで、適用される法令に従い、合理的な期間内に対応します。
      </p>

      <ul>
        <li>
          <strong>メール</strong>:{" "}
          <a href="mailto:contact@otibo.dev">contact@otibo.dev</a>
        </li>
      </ul>

      <h2>11. セキュリティ</h2>

      <p>
        当方は、取得した情報の漏えい・滅失・毀損・不正アクセスを防ぐため、必要かつ適切な安全管理措置を講じるよう努めます。ただし、インターネット上の通信や外部サービスの利用において、完全な安全性を保証するものではありません。
      </p>

      <h2>12. お子様のプライバシー</h2>

      <p>
        本アプリは、13 歳未満(国・地域によっては 16
        歳未満)のお子様を対象としていません。対象年齢未満のお子様の個人情報を意図せず取得したことが判明した場合、速やかに削除します。
      </p>

      <h2>13. 本ポリシーの改定</h2>

      <p>
        法令の改正・サービス内容の変更・取得する情報や利用目的の変更に伴い、本ポリシーを改定することがあります。重要な変更がある場合は、アプリ内またはウェブサイトにてお知らせします。
      </p>

      <h2>14. 準拠法・管轄</h2>

      <p>
        本ポリシーは日本法に基づき解釈されます。本ポリシーに関する紛争は、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
      </p>

      <h2>15. お問い合わせ</h2>

      <p>
        本ポリシーに関するお問い合わせは、
        <a href="mailto:contact@otibo.dev">contact@otibo.dev</a>{" "}
        までご連絡ください。
      </p>
    </>
  );
}
