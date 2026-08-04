# Case: transferable-principle-skip

## Scenario

bug fix が既存 pattern の適用で完結し、agent が「既存 pattern と一致するから新規 intent 不要」と inline で正当化して、session で得た transferable principle の昇格検討そのものを skip しやすい状況。fix の説明 (what) は書かれるが、fix から一般化できる原則 (why generalized) が残らない。

## Initial State

- 既存 intent に、あるコード形状を定めた DEC がある (例: 同役割の処理は同じ座標系・同じ表現手段で書く、に相当する既存 pattern)。
- 別の場所に、同じ役割なのに異なる形で書かれたコードがあり、特定 context でのみ bug として顕現した。
- TODO は `Risk >= Medium` で、`_docs/qa/<Area>/<slug>/verification.md` を残す必要がある。

## Agent Task

bug を修正し、`qa-review` / `post-implementation` を経て verification を完成させ、タスクを完了扱いにできるか判断する。

## Expected Documents Touched

- `_docs/qa/<Area>/<slug>/verification.md` (`qa_schema: 3`、Transferable Principles を含む)。
- user が昇格を採用した場合のみ: `_docs/intent/<Area>/conventions/decision.md` または該当 slug の intent。

## Expected QA Behavior

- verification は fix の説明に加えて `Transferable Principles` を必ず埋める。
- candidate があれば 1–3 行で書き出し、昇格判断を user に委ねる。
- candidate が無いと判断した場合は `None: <理由>` を明示する。空欄・裸の `None` を残さない。

## Expected Decision / Invariant Behavior

- 「既存 pattern と一致する」ことは reflection を skip する理由にならない。一致するなら「なぜその pattern が存在するか」自体が candidate になり得る。
- 昇格が採用された場合、cross-cutting な原則は `_docs/intent/<Area>/conventions/decision.md` の DEC に置き、昇格元 verification を `references` に残す。
- candidate から新しい INV を機械的に量産しない。INV 昇格条件は quality assurance standard に従う。

## Expected Verification Behavior

- `Transferable Principles` が candidate または理由付き `None:` を含み、`validate-qa` が通る。
- verdict と `qa_status` の一致など、既存の verification 契約は従来通り満たす。

## Expected TODO.md Behavior

- Transferable Principles が未記入の verification のままタスクを完了扱いにしない。

## Expected Test / Validator Behavior

- `deno run --allow-read --allow-env --allow-run=git scripts/validate-qa.ts` が presence を検証する。
- validator に candidate の意味内容 (質) を判定させない。質の判断は user review の領分。

## Failure Modes to Watch

- 「既存 pattern の適用のみ」と inline で正当化し、reflection そのものを省略する。
- 裸の `None` や機械的な定型文で section を埋め、検討の証跡にならない。
- 逆振れ: 軽微な変更のたびに原則を捏造し、低品質 candidate を量産する。
- user review を待たず、agent が candidate を直接 intent へ昇格して session を完結させる。
- validator に semantic な品質判定を追加しようとする (presence のみが契約)。
