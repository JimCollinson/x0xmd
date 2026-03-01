import { canonicalModel } from "../model/canonical.js";

export const FIRST_USE_SCHEMA_VERSION = "1.0.0";

function buildEventHandlingScenario() {
  const streamFields = canonicalModel.events.envelope.required_fields.map((field) => field.name);

  return {
    id: "subscribe-receive-trust-decide",
    goal: "Subscribe, parse canonical event fields, evaluate trust, and choose a deterministic action.",
    event_contract_path: "/machine/events-contract",
    steps: [
      {
        step: "subscribe",
        operation_id: "subscribe-topic",
        request: {
          method: "POST",
          path: "/subscribe",
          body: {
            topic: "fae.chat"
          }
        },
        expected_response: {
          status_code: 200,
          body: {
            ok: true,
            subscription_id: "d2f70b5e977adf50"
          }
        }
      },
      {
        step: "receive-event",
        stream_path: canonicalModel.events.stream.path,
        expected_required_fields: streamFields,
        frame_example: {
          event_id: "evt_01j5n9j9j6xkrf2v6v3m1nb5e7",
          topic: "fae.chat",
          publisher_agent_id: "4f7f19bcb267fdbf18ea22d5d176a31fd9f73f4ceeb8e0f2d39d4e5e8fbec123",
          payload_base64: "SGVsbG8gZnJvbSB4MHg=",
          signature: "bWwtZHNhLXNpZ25hdHVyZS1ieXRlcw==",
          received_at: "2026-03-01T10:24:18.220Z",
          trust_level: "trusted"
        }
      },
      {
        step: "trust-check",
        policy: "only_trusted_or_known_can_trigger_automation",
        predicate: "trust_level in ['known','trusted'] AND signature verifies",
        on_fail: "drop_event_and_log"
      },
      {
        step: "action-decision",
        if_true: {
          action: "decode_payload_and_dispatch",
          idempotency_key: "event_id"
        },
        if_false: {
          action: "record_rejection",
          reason_fields: ["event_id", "trust_level"]
        }
      }
    ]
  };
}

export function buildFirstUseArtifact() {
  return {
    schema_version: FIRST_USE_SCHEMA_VERSION,
    contract_version: canonicalModel.first_use.contract_version,
    daemon_base_url: canonicalModel.first_use.daemon_base_url,
    lifecycle: {
      current: {
        ...canonicalModel.first_use.current,
        event_scenarios: [buildEventHandlingScenario()]
      },
      planned: canonicalModel.first_use.planned
    }
  };
}
