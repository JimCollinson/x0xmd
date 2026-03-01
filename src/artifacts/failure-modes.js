export const FAILURE_MODES_SCHEMA_VERSION = "1.0.0";
export const FAILURE_MODES_PATH = "/machine/failure-modes";

export function buildFailureModesArtifact() {
  return {
    schema_version: FAILURE_MODES_SCHEMA_VERSION,
    contract_version: "2026-03-01",
    lifecycle: {
      current: {
        matrix: [
          {
            code: "network.timeout",
            failure_class: "network",
            retry_class: "transient",
            retryable: true,
            retry_after_hint: "200ms-5s exponential backoff with jitter",
            recommended_action: "retry_request_with_backoff",
            escalation: "escalate_after_max_attempts"
          },
          {
            code: "auth.untrusted_sender",
            failure_class: "auth_trust",
            retry_class: "policy_gate",
            retryable: false,
            retry_after_hint: "none",
            recommended_action: "set_contact_trust_or_reject",
            escalation: "manual_trust_review"
          },
          {
            code: "signature.invalid",
            failure_class: "signature_integrity",
            retry_class: "integrity_hard_fail",
            retryable: false,
            retry_after_hint: "none",
            recommended_action: "drop_event_and_request_republish",
            escalation: "security_incident_if_repeated"
          },
          {
            code: "permission.denied",
            failure_class: "permission",
            retry_class: "policy_gate",
            retryable: false,
            retry_after_hint: "none",
            recommended_action: "request_required_scope_or_role",
            escalation: "operator_access_review"
          },
          {
            code: "schema.invalid_payload",
            failure_class: "schema_validation",
            retry_class: "caller_fix_required",
            retryable: false,
            retry_after_hint: "none",
            recommended_action: "correct_payload_and_resubmit",
            escalation: "open_integration_bug_if_unknown_field"
          },
          {
            code: "daemon.unavailable",
            failure_class: "daemon_unavailable",
            retry_class: "transient",
            retryable: true,
            retry_after_hint: "1s-30s incremental backoff",
            recommended_action: "probe_health_then_reconnect",
            escalation: "restart_daemon_or_host"
          }
        ]
      },
      planned: []
    }
  };
}
