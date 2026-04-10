package chatd

import (
	"charm.land/fantasy"

	"github.com/coder/coder/v2/coderd/database"
)

// WaitUntilIdleForTest waits for background chat work tracked by the server to
// finish without shutting the server down. Tests use this to assert final
// database state only after asynchronous chat processing has completed.
// Close waits for the same tracked work, but also stops the server.
func WaitUntilIdleForTest(server *Server) {
	server.drainInflight()
}

// TurnPolicyForTest exports the unexported turnPolicy type for testing.
type TurnPolicyForTest = turnPolicy

// ResolveTurnPolicyForTest exports resolveTurnPolicy for testing.
func ResolveTurnPolicyForTest(mode database.NullChatTurnMode) TurnPolicyForTest {
	return resolveTurnPolicy(mode)
}

// TurnPolicyAllowedToolsForTest exports turnPolicy.allowedTools for testing.
func TurnPolicyAllowedToolsForTest(tp TurnPolicyForTest, allTools []fantasy.AgentTool) []string {
	return tp.allowedTools(allTools)
}

// TurnPolicyStopAfterToolsForTest exports turnPolicy.stopAfterTools for
// testing.
func TurnPolicyStopAfterToolsForTest(tp TurnPolicyForTest) map[string]bool {
	return tp.stopAfterTools()
}
