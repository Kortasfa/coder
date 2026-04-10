package chattool_test

import (
	"context"
	"encoding/json"
	"testing"

	"charm.land/fantasy"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"golang.org/x/xerrors"

	"github.com/coder/coder/v2/codersdk/workspacesdk"
)

type planTurnToolFactory func(
	getWorkspaceConn func(context.Context) (workspacesdk.AgentConn, error),
	isPlanTurn bool,
) fantasy.AgentTool

func assertToolOK(t *testing.T, resp fantasy.ToolResponse) {
	t.Helper()
	assert.False(t, resp.IsError)

	var result map[string]bool
	require.NoError(t, json.Unmarshal([]byte(resp.Content), &result))
	assert.Equal(t, map[string]bool{"ok": true}, result)
}

func assertPlanTurnPathRejected(
	t *testing.T,
	newTool planTurnToolFactory,
	input string,
	wantMessage string,
) {
	t.Helper()

	getWorkspaceConnCalled := false
	tool := newTool(func(context.Context) (workspacesdk.AgentConn, error) {
		getWorkspaceConnCalled = true
		return nil, xerrors.New("should not resolve workspace connection")
	}, true)

	resp, err := tool.Run(context.Background(), fantasy.ToolCall{
		ID:    "call-1",
		Name:  tool.Info().Name,
		Input: input,
	})
	require.NoError(t, err)
	assert.True(t, resp.IsError)
	assert.Contains(t, resp.Content, wantMessage)
	assert.False(t, getWorkspaceConnCalled)
}
