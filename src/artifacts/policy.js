import { canonicalModel } from "../model/canonical.js";

export const POLICY_SCHEMA_VERSION = "1.0.0";
export const POLICY_PATH = "/machine/policy";

function buildDeterministicRules() {
  return canonicalModel.trust.current.action_gating_matrix.map((entry) => ({
    action_class: entry.action_class,
    allowed_levels: entry.allowed_levels,
    blocked_levels: entry.blocked_levels,
    required_signatures: entry.required_signatures,
    default_decision: entry.decision_default
  }));
}

export function buildPolicyArtifact() {
  return {
    schema_version: POLICY_SCHEMA_VERSION,
    contract_version: canonicalModel.trust.contract_version,
    policy_id: "x0xmd-trust-enforcement-v1",
    evaluation_contract: {
      input_schema: {
        required_fields: [
          {
            name: "sender_trust_level",
            type: "string",
            enum: ["unknown", "known", "trusted", "blocked"]
          },
          {
            name: "signature_state",
            type: "string",
            enum: ["verified", "invalid", "missing", "not_required"]
          },
          {
            name: "action_class",
            type: "string",
            enum: ["publish", "subscribe", "mutate_contacts", "task_list_write"]
          },
          {
            name: "endpoint_context",
            type: "object",
            required_keys: ["path", "method", "channel"]
          }
        ]
      },
      output_schema: {
        required_fields: [
          {
            name: "decision",
            type: "string",
            enum: ["allow", "deny", "needs-human"]
          },
          {
            name: "reason_code",
            type: "string",
            enum: [
              "policy.allow",
              "policy.deny.blocked-trust",
              "policy.deny.signature-required",
              "policy.deny.trust-level",
              "policy.needs-human.high-impact"
            ]
          }
        ]
      }
    },
    deterministic_rules: buildDeterministicRules(),
    default_behavior: {
      unknown_action_class: {
        decision: "deny",
        reason_code: "policy.deny.trust-level"
      },
      signature_required_but_not_verified: {
        decision: "deny",
        reason_code: "policy.deny.signature-required"
      },
      blocked_sender: {
        decision: "deny",
        reason_code: "policy.deny.blocked-trust"
      }
    },
    evaluation_examples: [
      {
        id: "allow-trusted-publish",
        input: {
          sender_trust_level: "trusted",
          signature_state: "verified",
          action_class: "publish",
          endpoint_context: {
            path: "/publish",
            method: "POST",
            channel: "runtime"
          }
        },
        output: {
          decision: "allow",
          reason_code: "policy.allow"
        }
      },
      {
        id: "deny-invalid-signature",
        input: {
          sender_trust_level: "trusted",
          signature_state: "invalid",
          action_class: "publish",
          endpoint_context: {
            path: "/publish",
            method: "POST",
            channel: "runtime"
          }
        },
        output: {
          decision: "deny",
          reason_code: "policy.deny.signature-required"
        }
      },
      {
        id: "needs-human-contact-mutation",
        input: {
          sender_trust_level: "trusted",
          signature_state: "verified",
          action_class: "mutate_contacts",
          endpoint_context: {
            path: "/contacts/trust",
            method: "POST",
            channel: "runtime"
          }
        },
        output: {
          decision: "needs-human",
          reason_code: "policy.needs-human.high-impact"
        }
      },
      {
        id: "deny-blocked-subscribe",
        input: {
          sender_trust_level: "blocked",
          signature_state: "not_required",
          action_class: "subscribe",
          endpoint_context: {
            path: "/subscribe",
            method: "POST",
            channel: "runtime"
          }
        },
        output: {
          decision: "deny",
          reason_code: "policy.deny.blocked-trust"
        }
      }
    ]
  };
}
