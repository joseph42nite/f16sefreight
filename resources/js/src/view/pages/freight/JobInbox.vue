<template>
  <div class="fx-inbox" :class="{ 'is-split': workspace }">
    <!--
      §9.2 THREE COLUMNS: folders -> threads -> conversation. The shape matters — an
      operator triaging fifty conversations a morning needs the list to stay put while
      the conversation changes. A single-pane inbox that navigates away and back loses
      scroll position on every decision.
    -->
    <aside class="fx-inbox__folders" aria-label="Folders" data-help="inbox-folders">
      <button
        v-for="f in folders"
        :key="f.key"
        class="fx-folder"
        :class="{ 'is-active': folder === f.key }"
        @click="select(f.key)"
      >
        <span>{{ f.label }}</span>
        <span class="fx-folder__count">{{ counts[f.key] === undefined ? "" : counts[f.key] }}</span>
      </button>
    </aside>

    <section class="fx-inbox__list" aria-label="Conversations">
      <div class="fx-inbox__search">
        <input v-model="query" class="fx-input" type="search" placeholder="Subject or sender…" @input="debounced" />
      </div>

      <p v-if="loading" class="fx-muted fx-inbox__pad">Loading…</p>
      <p v-else-if="error" class="fx-error fx-inbox__pad" role="alert">{{ error }}</p>
      <p v-else-if="!threads.length" class="fx-muted fx-inbox__pad">Nothing here.</p>

      <!-- Like Gmail: 50 conversations, and the next 50 as you scroll near the end (user, 2026-09-15). -->
      <ul v-else class="fx-threads" @scroll="onThreadsScroll">
        <li
          v-for="t in threads"
          :key="t.id"
          class="fx-thread"
          :class="{ 'is-active': active && active.id === t.id, 'is-unread': t.status === 'unread' }"
          tabindex="0"
          @click="open(t)"
          @keydown.enter="open(t)"
        >
          <div class="fx-thread__row">
            <span class="fx-thread__from">{{ t.from }}</span>
            <span class="fx-thread__when"><Figure :value="t.latest_message_received_at" kind="date" /></span>
          </div>
          <div class="fx-thread__subject">{{ t.subject }}</div>
          <div class="fx-thread__row">
            <StatusChip :value="t.classification" />
            <!-- The pool is what nobody owns yet. Saying so on the row is what makes
                 the claim button mean something. -->
            <span v-if="t.assigned_ops" class="fx-thread__owner">{{ t.assigned_ops.name }}</span>
            <span v-else class="fx-thread__owner fx-thread__owner--free">Unassigned</span>
          </div>
        </li>
        <li v-if="loadingMore" class="fx-muted fx-inbox__pad" role="status">Loading more…</li>
      </ul>
    </section>

    <section ref="convo" class="fx-inbox__convo" aria-label="Conversation">
      <p v-if="!active" class="fx-muted fx-inbox__pad">Select a conversation.</p>

      <template v-else>
        <header class="fx-convo__head">
          <div>
            <h2 class="fx-convo__subject">{{ active.subject }}</h2>
            <p class="fx-convo__meta">
              {{ active.from }} · {{ active.message_count }} message{{ active.message_count === 1 ? "" : "s" }}
              <!-- 🔗 Once the enquiry converts, the JOB number is the one people quote to
                   each other; the enquiry number stops being the live handle. -->
              <template v-if="active.job">
                · <span class="identifier">{{ active.job.execution_job_no }}</span>
              </template>
              <template v-else-if="active.enquiry">
                · <span class="identifier">{{ active.enquiry.enquiry_no }}</span>
              </template>
            </p>
          </div>

          <div class="fx-convo__actions">
            <!-- Sales read and answer; they do not take shipments on. -->
            <button
              v-if="!active.assigned_ops && designation !== 'sales'"
              class="fx-btn"
              :disabled="busy"
              data-help="claim-thread"
              @click="startClaim"
            >Claim</button>

            <!--
              §8.1 role forbids -> HIDDEN. Only pricing re-classifies; operations reads
              and claims. A disabled dropdown would just invite "why can't I?" tickets.
            -->
            <select v-if="canTriage" v-model="pending" class="fx-input" :disabled="busy" data-help="thread-classification" @change="classify">
              <option v-for="c in CLASSIFICATIONS" :key="c" :value="c">{{ c.replace(/_/g, " ") }}</option>
            </select>

            <!--
              §9.2 the split-pane. Opening the workspace slides the folder and thread
              columns off-screen LEFT and gives the conversation and the workspace 50%
              each — because verification happens WHILE reading the email that carried
              the document. A workspace that covers the conversation makes the operator
              memorise a consignee name instead of checking it, and a mis-keyed
              consignee is a rejected filing.
            -->
            <!--
              Hand the conversation to another pricing colleague in the branch (user, 2026-09-16). Pricing assigns
              directly; the new owner is told in their bell.
            -->
            <select
              v-if="canAssign && assignees.length"
              class="fx-input fx-convo__assign"
              :value="active.assigned_ops ? active.assigned_ops.id : ''"
              aria-label="Assign this conversation"
              @change="assignThread($event.target.value)"
            >
              <option value="" disabled>Assign to…</option>
              <option v-for="o in assignees" :key="o.id" :value="o.id">{{ o.name }}</option>
            </select>


            <button v-if="designation !== 'sales'" class="fx-btn fx-btn--primary" data-help="open-workspace" @click="openWorkspace">Open workspace</button>
          </div>
        </header>

        <p v-if="actionError" class="fx-error fx-inbox__pad" role="alert">{{ actionError }}</p>
        <p v-if="attachmentError" class="fx-error fx-inbox__pad" role="alert">{{ attachmentError }}</p>

        <!-- The client update waiting on this conversation: send it as it is, edit it, or skip it. -->
        <section v-if="active.client_update && designation !== 'sales'" class="fx-update-card" aria-label="Client update">
          <h3 class="fx-update-card__title">Client update ready — {{ active.client_update.title }}</h3>
          <ClientUpdateEditor
            :key="active.id + '-' + active.client_update.stage"
            :draft="active.client_update"
            :busy="updateBusy"
            :error="updateError"
            @send="decideUpdate('send', $event)"
            @skip="decideUpdate('skip')"
          />
        </section>

        <!-- Claiming shows the acknowledgement mail first (user, 2026-09-16). -->
        <div v-if="claimDraft" class="fx-modal" role="dialog" aria-modal="true" aria-label="Claim this conversation">
          <div class="fx-modal__panel">
            <header class="fx-modal__head">
              <h2 class="fx-modal__title">Claim and tell the client</h2>
            </header>
            <div class="fx-modal__body">
              <ClientUpdateEditor
                :draft="claimDraft"
                :busy="busy"
                :error="updateError"
                send-label="Claim & send"
                skip-label="Claim without email"
                @send="claim({ decision: 'send', ...$event })"
                @skip="claim({ decision: 'skip' })"
              >
                <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="claimDraft = null">Cancel</button>
              </ClientUpdateEditor>
            </div>
          </div>
        </div>

        <!--
          §4.2 the SLA pair, side by side and never conflated. first_triage_at is
          somebody looking; first_response_at is something being SENT. Reporting the
          first as a response claims an SLA the client never experienced.
        -->
        <dl class="fx-defs fx-convo__sla">
          <dt>First triaged</dt>
          <dd><Figure :value="active.first_triage_at" kind="dateTime" /></dd>
          <dt>First replied</dt>
          <dd><Figure :value="active.first_response_at" kind="dateTime" /></dd>
        </dl>

        <ol class="fx-messages">
          <li
            v-for="m in messages"
            :key="m.id"
            class="fx-message"
            :class="'fx-message--' + m.direction"
          >
            <div class="fx-message__head">
              <span class="fx-message__from">{{ m.from }}</span>
              <span class="fx-message__when"><Figure :value="m.received_at" kind="dateTime" /></span>
            </div>
            <!-- Who else was on it. Without this an operator cannot tell a private reply
                 from one the airline and the broker are both reading. -->
            <div class="fx-message__to">
              to {{ m.to || "—" }}<template v-if="m.cc"> · cc {{ m.cc }}</template>
            </div>
            <p class="fx-message__body">{{ m.body_snippet }}</p>

            <!--
              🔴 The files the mail carried (guide §4.2). Listed at sync; the bytes are fetched,
              virus-scanned and kept only when someone opens one. A PDF can go straight into
              Extraction, beside the mail that carried it.
            -->
            <ul v-if="m.attachments && m.attachments.length" class="fx-attachments" data-help="mail-attachments">
              <li v-for="a in m.attachments" :key="a.id" class="fx-attachment">
                <button
                  type="button"
                  class="fx-attachment__open"
                  :disabled="attachmentBusy === a.id || a.fetch_state === 'blocked'"
                  :title="a.fetch_state === 'blocked' ? 'Blocked by the virus scan' : 'Open ' + a.filename"
                  @click="openAttachment(a)"
                >
                  📎 {{ a.filename }}
                  <span v-if="a.size_bytes" class="fx-muted">{{ fileSize(a.size_bytes) }}</span>
                  <span v-if="attachmentBusy === a.id" class="fx-muted">· opening…</span>
                  <span v-if="a.fetch_state === 'blocked'" class="fx-error">· blocked by virus scan</span>
                </button>
                <button
                  v-if="canExtractAttachments && isPdf(a) && a.fetch_state !== 'blocked'"
                  type="button"
                  class="fx-btn fx-btn--ghost"
                  :disabled="attachmentBusy === a.id"
                  @click="extractAttachment(a)"
                >Extract</button>
              </li>
            </ul>
          </li>
        </ol>

        <!--
          The composer. Reply / Reply all / Forward are the SAME send with different
          starting recipients, and every field stays editable afterwards — in a real mail
          client those buttons are a starting point, never a command. An operator drops
          the airline from a commercial reply routinely.
        -->
        <section v-if="messages.length" class="fx-compose">
          <div v-if="!composing" class="fx-compose__actions">
            <button class="fx-btn fx-btn--primary" data-help="reply" @click="compose('reply')">Reply</button>
            <button class="fx-btn" data-help="reply-all" @click="compose('replyAll')">Reply all</button>
            <button class="fx-btn" data-help="forward" @click="compose('forward')">Forward</button>
          </div>

          <template v-else>
            <label class="fx-field">
              <span class="fx-field__label">To</span>
              <input v-model="draft.to" class="fx-input" placeholder="comma separated" />
            </label>
            <label class="fx-field">
              <span class="fx-field__label">Cc</span>
              <input v-model="draft.cc" class="fx-input" placeholder="comma separated" />
            </label>
            <label class="fx-field">
              <span class="fx-field__label">Subject</span>
              <input v-model="draft.subject" class="fx-input" />
            </label>
            <!-- 🔴 PRD §5.2.4: eight formatting controls, email-safe HTML, cleaned again on the server. -->
            <MailEditor v-model="draft.body" data-help="compose-editor" />

            <!--
              The signature comes from Settings → Mailboxes and is added by the server, so it
              cannot be mangled per message. The switch turns it off for one email.
            -->
            <label class="fx-checkbox fx-compose__signature-switch" data-help="add-signature">
              <input v-model="draft.includeSignature" type="checkbox" />
              <span>Add signature</span>
            </label>
            <!-- eslint-disable-next-line vue/no-v-html — cleaned by HTMLPurifier on the server -->
            <div v-if="draft.includeSignature && signature" class="fx-compose__signature" v-html="signature"></div>
            <p v-else-if="draft.includeSignature" class="fx-muted">
              No signature set for this mailbox. Add one in Settings → Mailboxes.
            </p>

            <!--
              🔴 ATTACHMENTS (PRD §5.2.3): from the operator's computer, or files already on this
              conversation. Forward starts with the forwarded mail's own files. Up to 25 MB
              together; every upload is virus-scanned by the server before it leaves.
            -->
            <div class="fx-compose__attach">
              <button type="button" class="fx-btn" :disabled="sending" data-help="attach-files" @click="$refs.attachPicker.click()">📎 Attach files</button>
              <input ref="attachPicker" type="file" multiple class="fx-drop__input" @change="onAttach" />

              <div v-if="threadAttachments.length" class="fx-multi">
                <button
                  type="button"
                  class="fx-input fx-multi__button"
                  :disabled="sending"
                  aria-haspopup="listbox"
                  :aria-expanded="String(pickingThreadFiles)"
                  @click="pickingThreadFiles = !pickingThreadFiles"
                >From this conversation{{ draft.attachmentIds.length ? " (" + draft.attachmentIds.length + ")" : "" }}</button>
                <ul v-if="pickingThreadFiles" class="fx-multi__menu" role="listbox" aria-multiselectable="true">
                  <li
                    v-for="a in threadAttachments"
                    :key="a.id"
                    role="option"
                    :aria-selected="String(draft.attachmentIds.includes(a.id))"
                    class="fx-multi__option"
                    @click="toggleThreadFile(a.id)"
                  ><span class="fx-multi__tick">{{ draft.attachmentIds.includes(a.id) ? "✓" : "" }}</span>{{ a.filename }}
                    <span v-if="a.size_bytes" class="fx-muted">{{ fileSize(a.size_bytes) }}</span></li>
                </ul>
              </div>
            </div>

            <ul v-if="attachedList.length" class="fx-attachments">
              <li v-for="f in attachedList" :key="f.key" class="fx-attachment">
                <span class="fx-attachment__open">📎 {{ f.name }}
                  <span v-if="f.size" class="fx-muted">{{ fileSize(f.size) }}</span></span>
                <button type="button" class="fx-btn fx-btn--ghost" :aria-label="'Remove ' + f.name" :disabled="sending" @click="f.remove()">✕</button>
              </li>
            </ul>
            <p v-if="attachedBytes > ATTACHMENT_CAP_BYTES" class="fx-error" role="alert">
              The attachments come to {{ fileSize(attachedBytes) }}; a mail can carry at most 25 MB.
            </p>

            <div class="fx-compose__actions">
              <button class="fx-btn fx-btn--primary" :disabled="sending || !draft.to.trim() || !draft.body || attachedBytes > ATTACHMENT_CAP_BYTES" data-help="send-mail" @click="send">
                {{ sending ? "Sending…" : "Send" }}
              </button>
              <button class="fx-btn" :disabled="sending" @click="composing = false">Cancel</button>
            </div>
            <p v-if="sendError" class="fx-error">{{ sendError }}</p>
            <p v-if="sentOk" class="fx-muted">
              Sent. It will appear above once the mailbox syncs it back.
            </p>
          </template>
        </section>
      </template>
    </section>


    <FxDrawer
      :open="workspace && !!active"
      :title="active ? (active.subject || 'Workspace') : ''"
      :subtitle="active ? active.from : null"
      :tabs="workspaceTabs"
      :active-tab="tab"
      @tab="tab = $event"
      @close="closeWorkspace"
    >
      <!--
        The facts that identify this conversation, stated rather than tabbed. Enquiry and
        Timing each used to be a tab; both were always true and never changed while the
        drawer was open, so the click bought nothing.
      -->
      <!--
        🔴 The `v-if` lives on the DIV, never on the `<template #meta>`. A conditional
        v-slot template compiles into `$scopedSlots` instead of `$slots`, so FxDrawer's
        `v-if="$slots.meta"` went stale: the header kept the FIRST thread's enquiry and
        stopped updating when you clicked another one — which reads as "every enquiry is
        Lost" if the first one you opened happened to be.
      -->
      <template #meta>
        <div v-if="active" class="fx-drawer__facts">
          <!-- Converted: the job number and ITS status. The enquiry number is kept on
               the title so the lineage is recoverable without competing for the eye —
               it is history once a job exists, and the Enquiries board still lists it. -->
          <template v-if="active.job">
            <span class="identifier" :title="'Enquiry ' + (active.enquiry ? active.enquiry.enquiry_no : '—')">
              {{ active.job.execution_job_no }}
            </span>
            <StatusChip :value="active.job.status" />
            <!-- The third link in the chain, when the shipment already carries one. -->
            <span v-if="active.job.awb_number" class="identifier fx-drawer__awb">
              {{ active.job.awb_number }}
            </span>
            <span v-if="active.job_count > 1" class="fx-muted">
              +{{ active.job_count - 1 }} more on this enquiry
            </span>
          </template>
          <template v-else-if="active.enquiry">
            <span class="identifier">{{ active.enquiry.enquiry_no }}</span>
            <StatusChip :value="active.enquiry.status" />
          </template>
          <!-- ⚠️ Not promoted is a real state, not a blank. Classifying a conversation as
               a customer enquiry is what mints the number and turns it into work. -->
          <span v-else class="fx-muted">Not promoted to an enquiry</span>

          <span
            v-if="timing"
            class="fx-drawer__timing"
            :class="'is-' + timing.tone"
            :title="timingDetail"
          >{{ timing.label }}</span>
        </div>
      </template>

      <template v-if="active">
        <!--
          🔴 WHAT THE MAIL SAID, before anyone types anything. The classifier reads every
          inbound message and parks what it found; without showing it here that work was
          done and discarded, and the operator retyped figures the system already had.

          ⚠️ Read-only, deliberately. Confirming these onto the enquiry needs an endpoint
          that does not exist yet, and the lane needs the IATA/LOCODE question settled
          first — see GAPS. Showing a value the operator cannot commit is honest; showing
          a button that silently does nothing is not.
        -->
        <section v-if="stagedCargo.length" class="fx-staged">
          <h3 class="fx-staged__title">What the mail said</h3>
          <dl class="fx-staged__list">
            <div v-for="f in stagedCargo" :key="f.key" class="fx-staged__row">
              <dt>{{ f.label }}</dt>
              <dd>
                {{ f.value }}
                <!-- §1.3 never signal with colour alone — the word carries it. Low
                     confidence is prose read by a regex, not a field off a document. -->
                <span v-if="f.confidence === 'low'" class="fx-staged__flag">check</span>
              </dd>
            </div>
          </dl>

          <!--
            ⚠️ HIDDEN, not disabled, for anyone who cannot commit it. `updateCargo` is
            gated on `triage` — pricing owns the enquiry's figures — so an operations user
            reading the same mail sees what the parser found and no button, rather than one
            that answers 403. Same rule as the cost sheet tab.
          -->
          <div v-if="canConfirmCargo" class="fx-staged__actions">
            <button class="fx-btn" :disabled="cargoBusy" @click="confirmCargo">
              {{ cargoBusy ? "Saving…" : "Use these figures" }}
            </button>
            <span v-if="cargoSaved" class="fx-muted">Saved to the enquiry.</span>
          </div>
          <p v-if="cargoError" class="fx-error">{{ cargoError }}</p>
        </section>

        <!--
          ⚠️ Named, not blank. A drawer with nothing in it reads as broken; saying which
          classification unlocks the work turns it into an instruction the operator can act
          on — reclassify, or this is not that kind of conversation.
        -->
        <section v-if="tab !== 'credits' && !isEnquiryWork" class="fx-muted">
          <p>
            Extraction and the cost sheet are for <strong>customer enquiries</strong>. This
            conversation is filed as
            <StatusChip :value="active.classification" />.
          </p>
          <p>
            If a client's request arrived on it, re-classify it as a customer enquiry — that
            is what mints the number and turns it into work.
          </p>
        </section>

        <section v-else-if="tab === 'credits'">
          <CreditsPanel />
        </section>

        <!-- §6.7 — the cost sheet, decoupled from the manifest. -->
        <section v-else-if="tab === 'cost'">
          <p v-if="!active.enquiry" class="fx-muted">
            No enquiry on this conversation yet, so there is no job to cost.
          </p>
          <CostSheet v-else-if="jobId" :job-id="jobId" />
          <p v-else class="fx-muted">This enquiry has not been converted to a job yet.</p>
        </section>

        <section v-else-if="tab === 'extraction'">
          <!--
            🔴 THE OUTCOME GATE. A waybill is a document for a shipment that is HAPPENING.
            Drafting one against an enquiry nobody has confirmed produces paperwork for a
            shipment that may never fly — and, worse, leaves the enquiry sitting in the
            funnel as neither won nor lost while the operator moves on. So the decision is
            asked FIRST, and it is the same decision the Enquiries board reports on.
          -->
          <div v-if="active.enquiry && !active.job" class="fx-outcome">
            <template v-if="enquiryLost">
              <!-- 🔴 A loss the SWEEP declared is worded as a claim, not a verdict. The
                   desk never decided this; it stopped hearing back, and the operator is
                   the one who knows whether that is the same thing. -->
              <p v-if="active.enquiry.lost_automatically">
                <strong>Closed automatically</strong> — the client never answered our
                reminders, so this was marked <StatusChip value="lost" />. If that is
                wrong, reopen it.
              </p>
              <p v-else class="fx-muted">
                This enquiry is marked <StatusChip value="lost" />
                <template v-if="lostReasonLabel"> — {{ lostReasonLabel }}</template>.
                Nothing is drafted against a lost enquiry.
              </p>
              <!-- Reopening keeps the ORIGINAL number: it was already quoted to a client. -->
              <button class="fx-btn" :disabled="outcomeBusy" @click="reopenEnquiry">
                Client came back — reopen
              </button>
              <p class="fx-muted">Reopening keeps the same enquiry number.</p>
            </template>

            <template v-else-if="losing">
              <p><strong>Why was it lost?</strong> The reason is the whole point of
                recording it — a rate problem and a slow reply need different fixes.</p>
              <select v-model="lostReason" class="fx-input">
                <option v-for="r in LOST_REASONS" :key="r.value" :value="r.value">
                  {{ r.label }}
                </option>
              </select>
              <input
                v-if="lostReason === 'other'"
                v-model="lostCustom"
                class="fx-input"
                maxlength="255"
                placeholder="In your own words"
              />
              <div class="fx-outcome__actions">
                <button class="fx-btn" :disabled="outcomeBusy" @click="markLost">
                  Mark lost
                </button>
                <button class="fx-btn" :disabled="outcomeBusy" @click="losing = false">
                  Cancel
                </button>
              </div>
            </template>

            <template v-else>
              <p><strong>Did this shipment confirm?</strong></p>
              <p class="fx-muted">
                Confirming converts the enquiry to a job and opens AWB drafting. Until then
                there is nothing to raise a waybill against.
              </p>

              <label class="fx-field">
                <span class="fx-field__label">Clearance date</span>
                <input v-model="clearanceDate" type="date" class="fx-input" @change="loadOperators" />
              </label>

              <label class="fx-field">
                <span class="fx-field__label">Hand to an operator</span>
                <!--
                  ⚠️ OPTIONAL, and the empty option says so in words. Pricing may well run
                  the shipment themselves, and a blank first entry reads as "not chosen
                  yet" rather than as a deliberate decision.
                -->
                <select v-model="opsId" class="fx-input">
                  <option value="">Nobody yet — I'll handle it</option>
                  <option v-for="o in operators" :key="o.id" :value="o.id">
                    {{ operatorLabel(o) }}
                  </option>
                </select>
              </label>
              <p class="fx-muted">
                OLI is the operator's whole open book; the count beside it is how many
                shipments they already have clearing that day.
              </p>

              <div class="fx-outcome__actions">
                <button class="fx-btn fx-btn--primary" :disabled="outcomeBusy" @click="confirmShipment">
                  Shipment confirmed
                </button>
                <button class="fx-btn" :disabled="outcomeBusy" @click="losing = true">
                  Shipment lost
                </button>
              </div>
            </template>

            <p v-if="outcomeError" class="fx-error">{{ outcomeError }}</p>
          </div>

          <p v-else-if="!active.enquiry" class="fx-muted">
            No enquiry on this conversation yet, so there is no shipment to confirm.
          </p>

          <!-- The waybill this conversation is already about, so the operator is not
               asked to retype a number the job already holds. -->
          <ExtractionPanel v-else ref="extraction" :prefill-awb="jobAwb" :mail-cargo="active && active.staged_cargo" @apply="onExtracted" />
        </section>
      </template>

      <template #footer>
        <button class="fx-btn" @click="closeWorkspace">← Back to timeline</button>
      </template>
    </FxDrawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Vue from "vue";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";
import FxDrawer from "@/view/pages/freight/components/FxDrawer.vue";
import ExtractionPanel from "@/view/pages/freight/components/ExtractionPanel.vue";
import CostSheet from "@/view/pages/freight/components/CostSheet.vue";
import CreditsPanel from "@/view/pages/freight/components/CreditsPanel.vue";
import MailEditor from "@/view/pages/freight/components/MailEditor.vue";
import ClientUpdateEditor from "@/view/pages/freight/components/ClientUpdateEditor.vue";

/** PRD §5.2.3: what one mail can carry, all attachments together. The server enforces it too. */
const ATTACHMENT_CAP_BYTES = 25 * 1024 * 1024;

const CLASSIFICATIONS = ["customer_enquiry", "airline", "clearance", "trucking_road"];

/* §740's tab set. The two carrying real data today come first; the rest name the
   Step 6 item that fills them, so an unfinished tab cannot be mistaken for a bug. */
/**
 * The workspace holds WORK SURFACES, nothing else.
 *
 * 🔴 **Four tabs were removed on 2026-09-01, and two of them were lying.**
 *   Enquiry · Timing  two read-only fields and four timestamps. Both are always true of
 *                     the thread and never change while the drawer is open, so a tab made
 *                     the reader click to learn something that should simply be stated.
 *                     They live in the header now.
 *   Upload            duplicated [Analyze PDF], which already uploads from the
 *                     conversation header — beside the attachment that needs reading. Its
 *                     placeholder promised "Step 6 item 2", which IS the upload modal, and
 *                     was already built.
 *   E-Docket          its placeholder cited "Step 6 item 4", which is JobCostSheet — built,
 *                     and already the Cost sheet tab in this same drawer. The pointer was
 *                     simply wrong.
 *
 * ⚠️ A placeholder that names a step already delivered is worse than no placeholder: it
 * tells an operator to wait for something they could be using now.
 */
/** What each classification is called in the folder rail. */
const FOLDER_LABELS = {
  customer_enquiry: "Enquiries",
  airline: "Airline",
  shipping_line: "Shipping line",
  clearance: "Clearance",
  trucking_road: "Trucking",
  other: "Other",
};

/* Mirrors EnquiryController@markLost's validator exactly — the API rejects anything
   else, so a mismatch here would be a 422 the operator cannot read their way out of. */
const LOST_REASONS = [
  { value: "rates_high", label: "Rates too high" },
  { value: "delay_in_response", label: "We replied too slowly" },
  { value: "client_cancelled", label: "Client cancelled the shipment" },
  { value: "capacity_issue", label: "No capacity" },
  { value: "other", label: "Other" },
];

/** Mirrors `viewCostSheet` in AuthServiceProvider (Command only). The server is still the authority. */
const COST_SHEET_ROLES = ["pricing", "accounts", "boss"];

const WORKSPACE_TABS = [
  { key: "extraction", label: "Extraction" },
  { key: "cost", label: "Cost sheet" },
  // Credits per document (user, 2026-09-14) — for everyone who works in the workspace.
  { key: "credits", label: "Credits" },
];

export default {
  name: "JobInbox",
  components: { Figure, StatusChip, FxDrawer, ExtractionPanel, CostSheet, CreditsPanel, MailEditor, ClientUpdateEditor },
  data: () => ({
    /* 🔴 The mode's folders come from the SERVER, not a hardcoded list. An air operator
       has no use for a shipping-line folder and a sea operator none for an airline one;
       hardcoding air here is what put the wrong counterparty in front of both. Seeded with
       the mode-independent entries so the rail is never empty while the list loads. */
    folders: [
      { key: "all", label: "All" },
      { key: "unassigned", label: "Unassigned pool" },
    ],
    folder: "all",
    threads: [], counts: {}, messages: [],
    threadsPage: 1, threadsLastPage: 1, loadingMore: false,
    active: null, pending: null,
    loading: true, busy: false, error: null, actionError: null,
    query: "", timer: null,
    workspace: false, tab: "extraction", extracted: null, jobId: null, jobAwb: null,
    /* The outcome gate. `losing` is the two-step: the reason is REQUIRED by the API,
       so asking for it is not optional politeness. */
    losing: false, lostReason: "rates_high", lostCustom: "",
    /* The confirmation form. Both optional: pricing may run the shipment themselves,
       and a clearance date is often not known on the day the client confirms. */
    opsId: "", clearanceDate: "", operators: [],
    /* The composer. `draft` holds comma-separated strings because that is what the
       operator edits; splitting happens once, at send. */
    composing: false, sending: false, sendError: null, sentOk: false,
    cargoBusy: false, cargoError: null, cargoSaved: false,
    draft: { to: "", cc: "", subject: "", body: "", includeSignature: true, mode: "reply", inReplyTo: null, files: [], attachmentIds: [] },
    ATTACHMENT_CAP_BYTES,
    /** The "From this conversation" dropdown is open. */
    pickingThreadFiles: false,
    /** The signature a reply on the open thread carries — HTML, already cleaned by the server. */
    signature: null,
    /** The attachment being fetched, and why the last one could not be. */
    attachmentBusy: null, attachmentError: null,
    outcomeBusy: false, outcomeError: null,
    /** The acknowledgement shown when claiming, and the state of sending a client update. */
    claimDraft: null, updateBusy: false, updateError: null,
    LOST_REASONS,
    CLASSIFICATIONS, WORKSPACE_TABS,
  }),
  computed: {
    ...mapGetters(["designation", "currentUser", "tierAtLeast"]),
    /* Only pricing owns triage — re-classification mints or strands an enquiry. */
    canTriage() {
      return this.designation === "pricing";
    },
    /** Mirrors the server's `assignOperator`. */
    canAssign() {
      return this.designation === "pricing" || this.designation === "boss";
    },
    /** Who a conversation can be handed to: the other pricing staff in the branch. */
    assignees() {
      return this.operators.filter((o) => o.designation === "pricing" && !this.isMe(o));
    },
    /**
     * 🔴 TIMING AS A STATE, NOT FOUR TIMESTAMPS. The value in `first_triage_at` and
     * `first_response_at` is the CONTRAST between them — a time against triaged with a
     * dash against replied means somebody looked and the client is still waiting, which is
     * what makes `lost_reason = 'delay_in_response'` provable rather than asserted.
     *
     * Four raw datetimes in a header read as noise and leave the reader to do the
     * subtraction. The exact values stay available on hover.
     */
    /**
     * 🔴 Extraction and the cost sheet belong to a CUSTOMER ENQUIRY and nothing else.
     *
     * An airline confirming space, a broker filing a bill of entry, a trucker giving a
     * pickup slot — none of those get extracted into a waybill or costed. Offering the
     * tabs anyway invites an operator to start work the conversation cannot carry, and
     * then to wonder why the cost sheet says there is no job.
     */
    enquiryLost() {
      return !!this.active && !!this.active.enquiry && this.active.enquiry.status === "lost";
    },
    lostReasonLabel() {
      const r = this.active && this.active.enquiry && this.active.enquiry.lost_reason;
      const hit = LOST_REASONS.find((x) => x.value === r);
      return hit ? hit.label : null;
    },
    /**
     * The parsed figures, in the order an operator reads a shipment: what it is, how big,
     * where it goes.
     *
     * ⚠️ Labelled here rather than server-side because these are the classifier's own key
     * names — `gross_weight`, `volume_cbm` — and a UI label is not something the extraction
     * payload should be carrying.
     */
    /* Mirrors `triage` on the server: pricing owns the enquiry's figures. */
    canConfirmCargo() {
      return this.designation === "pricing"
        && !!this.active
        && !!this.active.enquiry
        && !this.active.job
        && this.stagedCargo.length > 0;
    },
    stagedCargo() {
      const cargo = (this.active && this.active.staged_cargo) || {};

      const LABELS = {
        pieces: "Pieces",
        gross_weight: "Gross weight",
        chargeable_weight: "Chargeable weight",
        volume_cbm: "Volume (CBM)",
        origin: "Origin",
        destination: "Destination",
      };

      return Object.keys(LABELS)
        .filter((k) => cargo[k] && cargo[k].value !== null && cargo[k].value !== undefined)
        .map((k) => ({
          key: k,
          label: LABELS[k],
          value: cargo[k].value,
          confidence: cargo[k].confidence,
        }));
    },
    /** Every file on this conversation, for the composer's picker. Blocked files cannot be sent. */
    threadAttachments() {
      return this.messages
        .flatMap((m) => m.attachments || [])
        .filter((a) => a.fetch_state !== "blocked");
    },
    /** What the draft carries, uploads and conversation files alike, each removable. */
    attachedList() {
      const picked = this.threadAttachments
        .filter((a) => this.draft.attachmentIds.includes(a.id))
        .map((a) => ({ key: "t" + a.id, name: a.filename, size: a.size_bytes, remove: () => this.toggleThreadFile(a.id) }));
      const uploads = this.draft.files.map((f, i) => ({
        key: "u" + i + f.name, name: f.name, size: f.size, remove: () => this.draft.files.splice(i, 1),
      }));

      return picked.concat(uploads);
    },
    attachedBytes() {
      return this.attachedList.reduce((sum, f) => sum + (f.size || 0), 0);
    },
    /** The Extraction panel exists only once the enquiry has a job (see the drawer's chain). */
    canExtractAttachments() {
      return this.isEnquiryWork && !!(this.active && this.active.enquiry && this.active.job);
    },
    /** Extraction and the cost sheet are shipment work: a customer enquiry, and not for sales. */
    isEnquiryWork() {
      return !!this.active && this.active.classification === "customer_enquiry" && this.designation !== "sales";
    },
    workspaceTabs() {
      if (this.designation === "sales") return [];

      // Credits are on every conversation (user, 2026-09-15): an operator working airline or clearance mail
      // still needs to see what extraction has used. On anything but an enquiry, Extraction explains itself.
      if (!this.isEnquiryWork) return WORKSPACE_TABS.filter((t) => t.key !== "cost");

      // 🔴 Mirrors the server's `viewCostSheet` — "operations never touches money"
      // (PRD §2.3.4). The tab was shown to them anyway and answered 403 on click: a
      // control that exists only to refuse is the "why can't I?" ticket this codebase
      // hides role-forbidden things to avoid. Extraction stays: operations works the
      // waybill, which is the whole reason they can open the workspace at all.
      //
      // ⚠️ An ALLOWLIST, so an unknown designation loses the tab rather than gaining it.
      // Command only: the sheet feeds accounts, and Tactical has no accounts (user, 2026-09-16).
      return WORKSPACE_TABS.filter(
        (t) => t.key !== "cost" || (COST_SHEET_ROLES.indexOf(this.designation) !== -1 && this.tierAtLeast("command"))
      );
    },
    timing() {
      const a = this.active;
      if (!a) return null;

      if (!a.first_triage_at) {
        return { label: "Not triaged yet", tone: "neutral" };
      }

      const triaged = new Date(a.first_triage_at);

      if (a.first_response_at) {
        return {
          label: "Answered " + this.elapsed(triaged, new Date(a.first_response_at)) + " after triage",
          tone: "success",
        };
      }

      /* Unanswered is the one worth noticing, so it is the one that gets a colour. */
      return {
        label: "Unanswered — " + this.elapsed(triaged, new Date()) + " since triage",
        tone: "warn",
      };
    },
    timingDetail() {
      const a = this.active;
      if (!a) return "";

      return [
        "Last inbound: " + this.stamp(a.latest_message_received_at),
        "First triaged: " + this.stamp(a.first_triage_at),
        "First replied: " + this.stamp(a.first_response_at),
        "Messages: " + (a.message_count == null ? "—" : a.message_count),
      ].join("\n");
    },
  },
  created() {
    this.load();
    // From a Kanban card or a bell notice: /inbox?thread=12 opens that conversation.
    if (this.$route.query.thread) this.open({ id: this.$route.query.thread });
    // The people a conversation can be handed to.
    if (this.canAssign) this.loadOperators();
  },
  watch: {
    "$route.query.thread"(id) {
      if (id) this.open({ id });
    },
  },
  mounted() {
    document.addEventListener("mousedown", this.closeThreadFiles);
  },
  /* Leaving the inbox with the workspace open would strand the body class and collapse
     the rail on every other screen. */
  beforeDestroy() {
    document.removeEventListener("mousedown", this.closeThreadFiles);
    document.body.classList.remove("fx-split");
  },
  methods: {
    /**
     * 🔴 THE CONVERSATION'S SCROLL POSITION SURVIVES THE TRANSITION (§9.2).
     *
     * The pane is re-laid-out from fluid width to 50%, which resets scrollTop. Losing
     * the reader's place halfway down a long thread is, in the guide's words, the
     * fastest way to make the feature feel broken — and it is worse than that here,
     * because the operator opened the workspace to transcribe something they were
     * looking at.
     *
     * The 60px rail is the AppShell's business, not this page's: a body class is the
     * smallest signal that crosses that boundary without inventing shared state.
     */
    setSplit(open) {
      const pane = this.$refs.convo;
      const top = pane ? pane.scrollTop : 0;

      this.workspace = open;
      document.body.classList.toggle("fx-split", open);

      /* ⚠️ Restored TWICE, and the second one is the one that matters.
         The pane changes width across the transition, so content reflows for the
         whole 200ms and the browser keeps re-deriving scrollTop underneath us.
         Setting it once on $nextTick lands mid-flight and drifts — measured at
         420 -> 434.5. The nextTick pass keeps the jump invisible; the settle pass
         puts it exactly back. */
      const restore = () => {
        if (this.$refs.convo) this.$refs.convo.scrollTop = top;
      };

      this.$nextTick(restore);

      /* transitionend, with a timer fallback: under prefers-reduced-motion there is
         no transition to end, and the event would never arrive. */
      const inbox = this.$el;
      const settle = (e) => {
        if (e && e.target !== inbox) return;
        inbox.removeEventListener("transitionend", settle);
        restore();
      };
      inbox.addEventListener("transitionend", settle);
      setTimeout(settle, 320);
    },
    /**
     * The operator ACCEPTED an extraction. Nothing is written to a document here —
     * §Step 6.2's pre-population of FocusAir.vue / HouseWayBill.vue is still to come,
     * and quietly stuffing values into a legal document on arrival would make the
     * confidence highlighting decorative.
     */
    /**
     * The operator has chosen what to take from where. Held, not written.
     *
     * ⚠️ Still nothing is pushed into FocusAir.vue / HouseWayBill.vue — that is Step 6.2.
     * Quietly stuffing values into a legal document would make the confidence marking
     * decorative, which is the one thing it must not be.
     */
    onExtracted(payload) {
      this.extracted = payload;
    },
    /**
     * Open the composer with the recipients each action starts from.
     *
     * 🔴 Built from the LAST INBOUND message, not the last message. Seeding a reply from
     * our own outbound mail addresses it to ourselves — and the operator only notices
     * after sending.
     *
     * ⚠️ Our own mailbox is dropped from reply-all. Every message on the thread has us on
     * it, so leaving it in copies the desk on its own reply, every time.
     */
    compose(mode) {
      const last = [...this.messages].reverse().find((m) => m.direction === "inbound")
        || this.messages[this.messages.length - 1];

      if (!last) return;

      // 🔴 TWO addresses come out, not one. The shared mailbox is on every message by
      // definition, and the signed-in person may be too — reply-all in any mail client
      // excludes you. Leaving either in copies the desk on its own reply, forever.
      const mine = [
        this.active && this.active.mailbox_address,
        this.currentUser && this.currentUser.email,
      ].filter(Boolean).map((a) => a.toLowerCase());

      const strip = (list) => (list || "")
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a && mine.indexOf(a.toLowerCase()) === -1);

      const subject = last.subject || "";
      const prefixed = (p) => (subject.toLowerCase().startsWith(p.toLowerCase()) ? subject : p + subject);

      if (mode === "forward") {
        // Forward deliberately starts EMPTY: it goes to someone not yet on the thread,
        // and pre-filling it with the current recipients is how a confidential rate
        // reaches the wrong party.
        this.draft = {
          to: "", cc: "", subject: prefixed("Fwd: "), body: "", includeSignature: true,
          // PRD §5.2.3: a forward re-attaches the original files, from the cache where fetched.
          mode: "forward", inReplyTo: last.id, files: [],
          attachmentIds: (last.attachments || []).filter((a) => a.fetch_state !== "blocked").map((a) => a.id),
        };
      } else {
        this.draft = {
          to: strip(last.from).join(", "),
          cc: mode === "replyAll" ? strip(last.cc).concat(strip(last.to)).join(", ") : "",
          subject: prefixed("Re: "),
          body: "",
          includeSignature: true,
          mode: "reply", inReplyTo: last.id, files: [], attachmentIds: [],
        };
      }

      this.sendError = null;
      this.sentOk = false;
      this.composing = true;
    },
    send() {
      const split = (v) => v.split(",").map((a) => a.trim()).filter(Boolean);

      this.sending = true;
      this.sendError = null;

      // Multipart, because files go with it.
      const form = new FormData();
      split(this.draft.to).forEach((a) => form.append("to[]", a));
      split(this.draft.cc).forEach((a) => form.append("cc[]", a));
      form.append("subject", this.draft.subject);
      form.append("body", this.draft.body);
      form.append("include_signature", this.draft.includeSignature ? "1" : "0");
      form.append("mode", this.draft.mode);
      if (this.draft.inReplyTo) form.append("in_reply_to", this.draft.inReplyTo);
      this.draft.attachmentIds.forEach((id) => form.append("attachment_ids[]", id));
      this.draft.files.forEach((f) => form.append("files[]", f));

      ApiService.post("/inbox/threads/" + this.active.id + "/reply", form)
        .then(({ data }) => {
          this.composing = false;
          this.sentOk = true;
          // Answering an unclaimed conversation takes it on, so the Claim button goes (user, 2026-09-15).
          if (data && data.assigned_ops) this.setOwner(data.assigned_ops);
          /* No optimistic row. The sent mail returns on the next mailbox sync as an echo,
             and inventing one here would show a message that might never have left. */
        })
        .catch((e) => { this.sendError = this.messageFor(e); })
        .finally(() => { this.sending = false; });
    },
    /**
     * Commit the staged figures onto the enquiry.
     *
     * ⚠️ Sends only what the parser actually found. A key the extraction did not produce
     * is not a value of NULL — it is a figure nobody has an opinion on, and sending NULL
     * would erase whatever is already there.
     */
    confirmCargo() {
      const cargo = (this.active && this.active.staged_cargo) || {};
      const MAP = {
        pieces: "extracted_pieces",
        gross_weight: "extracted_weight",
        volume_cbm: "extracted_volume",
        origin: "origin_code",
        destination: "dest_code",
      };

      const payload = {};
      Object.keys(MAP).forEach((k) => {
        if (cargo[k] && cargo[k].value !== null && cargo[k].value !== undefined) {
          payload[MAP[k]] = cargo[k].value;
        }
      });

      this.cargoBusy = true;
      this.cargoError = null;

      // ⚠️ `patch(resource, slug, params)` joins the first two with a slash. Passing the
      // whole path as `resource` and the payload as `slug` would PATCH
      // /enquiries/5/cargo/[object Object] — the request goes out and 404s.
      ApiService.patch("/enquiries/" + this.active.enquiry.id, "cargo", payload)
        .then(() => { this.cargoSaved = true; })
        .catch((e) => { this.cargoError = this.messageFor(e); })
        .finally(() => { this.cargoBusy = false; });
    },
    onAttach(e) {
      this.draft.files.push(...e.target.files);
      // Reset, or picking the same file again fires no change event.
      e.target.value = "";
    },
    toggleThreadFile(id) {
      const at = this.draft.attachmentIds.indexOf(id);
      if (at === -1) this.draft.attachmentIds.push(id);
      else this.draft.attachmentIds.splice(at, 1);
    },
    /** A click outside the open "From this conversation" dropdown closes it. */
    closeThreadFiles(event) {
      if (this.pickingThreadFiles && !event.target.closest(".fx-compose .fx-multi")) this.pickingThreadFiles = false;
    },
    isPdf(a) {
      return a.mime_type === "application/pdf" || /\.pdf$/i.test(a.filename || "");
    },
    fileSize(bytes) {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1048576) return Math.round(bytes / 1024) + " KB";
      return (bytes / 1048576).toFixed(1) + " MB";
    },
    /**
     * The file's bytes, through the API (the JWT is a header, so a plain link cannot fetch it).
     *
     * ⚠️ An error arrives as a Blob too, so its JSON is read back out for the message.
     */
    fetchAttachment(a) {
      this.attachmentBusy = a.id;
      this.attachmentError = null;

      return Vue.axios.get("/inbox/attachments/" + a.id, { responseType: "blob" })
        .then(({ data }) => {
          // Fetched once, then kept: the chip reflects it without reloading the thread.
          a.fetch_state = "cached";
          return data;
        })
        .catch(async (e) => {
          let message = "The file could not be opened.";
          try {
            const body = JSON.parse(await e.response.data.text());
            message = body.error || message;
            if (body.reason === "blocked") a.fetch_state = "blocked";
          } catch (ignored) { /* not JSON — keep the generic message */ }
          this.attachmentError = a.filename + ": " + message;
          throw e;
        })
        .finally(() => { this.attachmentBusy = null; });
    },
    openAttachment(a) {
      // ⚠️ The tab is opened NOW, inside the click; opened after the fetch it is a popup and blocked.
      const tab = window.open("", "_blank");

      this.fetchAttachment(a)
        .then((blob) => {
          const url = URL.createObjectURL(blob.type ? blob : new Blob([blob], { type: a.mime_type }));
          if (tab) tab.location.href = url;
          else window.location.href = url;
        })
        .catch(() => { if (tab) tab.close(); });
    },
    /** Straight into Extraction, staged — reading it is still an explicit Extract. */
    extractAttachment(a) {
      this.fetchAttachment(a)
        .then((blob) => {
          this.openWorkspace();
          this.openExtraction();

          // ⚠️ The panel renders when the drawer opens, which can be a few ticks away.
          const file = new File([blob], a.filename, { type: "application/pdf" });
          const hand = (tries) => {
            if (this.$refs.extraction) this.$refs.extraction.add([file]);
            else if (tries > 0) setTimeout(() => hand(tries - 1), 100);
          };
          this.$nextTick(() => hand(20));
        })
        .catch(() => {});
    },
    openExtraction() {
      this.tab = "extraction";
      this.setSplit(true);
    },
    /**
     * 🔴 Confirmed == converted. "A confirmed shipment" is not a flag on the enquiry;
     * it is the existence of a job row, which is why this posts to /convert rather than
     * setting a status. The AWB is deliberately NOT sent: the number is usually not known
     * at confirmation, and extraction is where it gets attached.
     */
    /**
     * Who could take this on, and how loaded they already are.
     *
     * ⚠️ Re-fetched when the clearance date changes, because `on_date` is the count for
     * THAT day — a stale one would recommend the wrong person with a confident number.
     */
    loadOperators() {
      const q = this.clearanceDate ? "?date=" + this.clearanceDate : "";
      ApiService.get("/jobs/staff-load" + q)
        .then(({ data }) => { this.operators = data.operators || []; })
        // Not fatal: confirming without an operator is a supported outcome, so a failed
        // lookup must not block the decision itself.
        .catch(() => { this.operators = []; });
    },
    operatorLabel(o) {
      const load = "OLI " + Number(o.oli).toFixed(1) + (o.overloaded ? " ● OVERLOADED" : "");
      return o.name + (this.isMe(o) ? " (you)" : "") + " — " + load + " · " + o.on_date + " that day";
    },
    isMe(o) {
      return !!this.currentUser && Number(this.currentUser.id) === Number(o.id);
    },
    /** The conversation's owner, on the open conversation and on its row in the list. */
    setOwner(owner) {
      this.active.assigned_ops = owner;
      const row = this.threads.find((t) => t.id === this.active.id);
      if (row) row.assigned_ops = owner;
    },
    assignThread(userId) {
      this.actionError = null;
      ApiService.post("/inbox/threads/" + this.active.id + "/assign", { user_id: Number(userId) })
        .then(({ data }) => { this.setOwner(data.assigned_ops); })
        .catch((e) => { this.actionError = this.messageFor(e); });
    },
    confirmShipment() {
      this.outcomeBusy = true;
      this.outcomeError = null;
      ApiService.post("/enquiries/" + this.active.enquiry.id + "/convert", {
        ops_id: this.opsId || null,
        planned_clearance_date: this.clearanceDate || null,
      })
        /* Reload rather than patch: conversion changes the enquiry's status, mints the
           job number and moves the thread's identifier — the server owns all of it. */
        .then(() => this.open(this.active))
        .catch((e) => { this.outcomeError = this.messageFor(e); })
        .finally(() => { this.outcomeBusy = false; });
    },
    markLost() {
      this.outcomeBusy = true;
      this.outcomeError = null;
      ApiService.post("/enquiries/" + this.active.enquiry.id + "/lost", {
        lost_reason: this.lostReason,
        lost_reason_custom: this.lostReason === "other" ? this.lostCustom : null,
      })
        .then(() => { this.losing = false; return this.open(this.active); })
        .catch((e) => { this.outcomeError = this.messageFor(e); })
        .finally(() => { this.outcomeBusy = false; });
    },
    reopenEnquiry() {
      this.outcomeBusy = true;
      this.outcomeError = null;
      ApiService.post("/enquiries/" + this.active.enquiry.id + "/reopen", {})
        .then(() => this.open(this.active))
        .catch((e) => { this.outcomeError = this.messageFor(e); })
        .finally(() => { this.outcomeBusy = false; });
    },
    /* ⚠️ A raw ISO string is not a date to a reader. The API sends
       2026-08-30T10:28:47.000000Z; a person needs 30 Aug 2026, 10:28. */
    stamp(value) {
      if (!value) return "—";

      const d = new Date(value);
      if (isNaN(d)) return String(value);

      return d.toLocaleString(undefined, {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    },
    /** Coarse on purpose: "3d" is the decision, "3d 4h 12m" is trivia. */
    elapsed(from, to) {
      const mins = Math.max(0, Math.round((to - from) / 60000));
      if (mins < 60) return mins + "m";
      if (mins < 1440) return Math.round(mins / 60) + "h";
      return Math.round(mins / 1440) + "d";
    },
    openWorkspace() {
      this.setSplit(true);

      // Only when the outcome gate is what the operator is about to see. Fetching the
      // branch's load for a thread that already has a job would be a request whose
      // answer nothing displays.
      if (this.active && this.active.enquiry && !this.active.job) {
        this.loadOperators();
      }
    },
    closeWorkspace() {
      this.setSplit(false);
    },
    select(key) {
      this.folder = key;
      this.load();
    },
    debounced() {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.load, 250);
    },
    params() {
      const p = [];
      if (this.folder === "unassigned") p.push("unassigned=1");
      else if (this.folder !== "all") p.push("classification=" + this.folder);
      if (this.query) p.push("q=" + encodeURIComponent(this.query));
      return p.length ? "?" + p.join("&") : "";
    },
    load() {
      this.loading = true;
      ApiService.get("/inbox/threads" + this.params())
        .then(({ data }) => {
          this.threads = data.data || [];
          this.threadsPage = data.current_page || 1;
          this.threadsLastPage = data.last_page || 1;

          /* The portal's own vocabulary — see EmailInboxController::classificationsForMode. */
          if (data.classifications) {
            this.folders = [
              { key: "all", label: "All" },
              { key: "unassigned", label: "Unassigned pool" },
              ...data.classifications.map((c) => ({ key: c, label: FOLDER_LABELS[c] || c })),
            ];
          }
          this.error = null;
          this.tally();
        })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    /** The next 50 when the list is scrolled to within a few rows of its end. */
    onThreadsScroll(e) {
      const list = e.target;
      const nearEnd = list.scrollTop + list.clientHeight >= list.scrollHeight - 200;

      if (!nearEnd || this.loadingMore || this.threadsPage >= this.threadsLastPage) return;

      this.loadingMore = true;
      const page = this.threadsPage + 1;
      ApiService.get("/inbox/threads" + this.params() + (this.params() ? "&" : "?") + "page=" + page)
        .then(({ data }) => {
          this.threads.push(...(data.data || []).filter((t) => !this.threads.some((x) => x.id === t.id)));
          this.threadsPage = data.current_page || page;
          this.threadsLastPage = data.last_page || this.threadsLastPage;
          this.tally();
        })
        .catch(() => {})
        .finally(() => { this.loadingMore = false; });
    },
    /* Counts come from the loaded page, so they describe what is on screen rather than
       claiming a total the list does not show. */
    tally() {
      const c = { all: this.threads.length };
      this.threads.forEach((t) => {
        c[t.classification] = (c[t.classification] || 0) + 1;
        if (!t.assigned_ops) c.unassigned = (c.unassigned || 0) + 1;
      });
      this.counts = c;
    },
    open(thread) {
      this.actionError = null;
      /* The outcome gate is per-conversation: a half-typed loss reason must not follow
         the operator to the next thread. */
      this.losing = false;
      this.outcomeError = null;
      this.lostReason = "rates_high";
      this.lostCustom = "";
      this.opsId = "";
      this.clearanceDate = "";
      this.composing = false;
      this.sendError = null;
      this.sentOk = false;
      this.cargoError = null;
      this.cargoSaved = false;
      // 🔴 "enquiry" was a TAB until it moved to the header, and this line kept resetting
      // to it — a key no section matches, so the workspace rendered nothing at all and
      // whatever the operator had typed appeared to vanish. Removing a tab means removing
      // every place that selects it.
      this.tab = "extraction";
      // Returned so an outcome action can re-open the thread and know when it has landed.
      return ApiService.get("/inbox/threads/" + thread.id)
        .then(({ data }) => {
          this.active = data.thread;
          this.pending = data.thread.classification;
          this.messages = data.messages || [];
          this.signature = data.signature || null;
          /* The cost sheet hangs off the JOB, not the thread, and extraction wants the
             AWB the shipment already carries rather than an empty box — that is what
             ties enquiry, job and waybill into one thread of work.

             ⚠️ This used to be a second GET /jobs?enquiry_id= fired after the thread
             loaded, which meant the list could never show a job number at all and the
             drawer showed one a beat late. The shape now carries it. */
          this.jobId = data.thread.job ? data.thread.job.id : null;
          this.jobAwb = (data.thread.job && data.thread.job.awb_number) || null;
        })
        .catch((e) => { this.actionError = this.messageFor(e); });
    },
    /** Show the acknowledgement mail first; a conversation with nothing to send is claimed straight away. */
    startClaim() {
      this.busy = true;
      this.actionError = null;
      this.updateError = null;
      ApiService.query("/inbox/threads/" + this.active.id + "/client-update/preview", { params: { stage: "claimed" } })
        .then(({ data }) => {
          this.busy = false;
          if (data.draft) this.claimDraft = data.draft;
          else this.claim(null);
        })
        .catch(() => { this.busy = false; this.claim(null); });
    },
    claim(update) {
      this.busy = true;
      ApiService.post("/inbox/threads/" + this.active.id + "/claim", update ? { client_update: update } : {})
        .then(({ data }) => {
          this.claimDraft = null;
          this.active = data;
          this.load();
          const r = data.client_update_result;
          if (r && !r.ok) this.actionError = "Claimed, but the mail did not go: " + r.error;
        })
        /* 409 is a real outcome, not a failure: someone got there first. */
        .catch((e) => { this.claimDraft = null; this.actionError = this.messageFor(e); this.load(); })
        .finally(() => { this.busy = false; });
    },
    decideUpdate(decision, values) {
      this.updateBusy = true;
      this.updateError = null;
      ApiService.post("/inbox/threads/" + this.active.id + "/client-update", {
        stage: this.active.client_update.stage, decision, ...(values || {}),
      })
        .then(({ data }) => { this.active = Object.assign({}, this.active, data); })
        .catch((e) => { this.updateError = this.messageFor(e); })
        .finally(() => { this.updateBusy = false; });
    },
    classify() {
      this.busy = true;
      this.actionError = null;
      ApiService.post("/inbox/threads/" + this.active.id + "/classify", { classification: this.pending })
        .then(({ data }) => { this.active = data; this.load(); })
        .catch((e) => {
          this.actionError = this.messageFor(e);
          /* Put the control back to the truth — the server refused the change. */
          this.pending = this.active.classification;
        })
        .finally(() => { this.busy = false; });
    },
    messageFor(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
