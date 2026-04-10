package chattool_test

import (
	"context"
	"encoding/json"
	"io"
	"testing"

	"charm.land/fantasy"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.uber.org/mock/gomock"
	"golang.org/x/xerrors"

	"github.com/coder/coder/v2/coderd/x/chatd/chattool"
	"github.com/coder/coder/v2/codersdk/workspacesdk"
	"github.com/coder/coder/v2/codersdk/workspacesdk/agentconnmock"
)

func TestWriteFilePlanTurn(t *testing.T) {
	t.Parallel()

	t.Run("PlanTurnAllowsCanonicalPath", func(t *testing.T) {
		t.Parallel()
		ctrl := gomock.NewController(t)
		mockConn := agentconnmock.NewMockAgentConn(ctrl)

		mockConn.EXPECT().
			WriteFile(gomock.Any(), "/home/coder/PLAN.md", gomock.Any()).
			DoAndReturn(func(_ context.Context, _ string, reader io.Reader) error {
				data, err := io.ReadAll(reader)
				require.NoError(t, err)
				assert.Equal(t, "# Plan", string(data))
				return nil
			})

		tool := chattool.WriteFile(chattool.WriteFileOptions{
			GetWorkspaceConn: func(context.Context) (workspacesdk.AgentConn, error) {
				return mockConn, nil
			},
			IsPlanTurn: true,
		})

		resp, err := tool.Run(context.Background(), fantasy.ToolCall{
			ID:    "call-1",
			Name:  "write_file",
			Input: `{"path":"/home/coder/PLAN.md","content":"# Plan"}`,
		})
		require.NoError(t, err)
		assertWriteFileOK(t, resp)
	})

	t.Run("PlanTurnRejectsNonCanonicalPath", func(t *testing.T) {
		t.Parallel()
		getWorkspaceConnCalled := false
		tool := chattool.WriteFile(chattool.WriteFileOptions{
			GetWorkspaceConn: func(context.Context) (workspacesdk.AgentConn, error) {
				getWorkspaceConnCalled = true
				return nil, xerrors.New("should not resolve workspace connection")
			},
			IsPlanTurn: true,
		})

		resp, err := tool.Run(context.Background(), fantasy.ToolCall{
			ID:    "call-1",
			Name:  "write_file",
			Input: `{"path":"/home/coder/foo.go","content":"package main"}`,
		})
		require.NoError(t, err)
		assert.True(t, resp.IsError)
		assert.Contains(t, resp.Content, "during plan turns, write_file is restricted to /home/coder/PLAN.md")
		assert.False(t, getWorkspaceConnCalled)
	})

	t.Run("NonPlanTurnAllowsAnyPath", func(t *testing.T) {
		t.Parallel()
		ctrl := gomock.NewController(t)
		mockConn := agentconnmock.NewMockAgentConn(ctrl)

		mockConn.EXPECT().
			WriteFile(gomock.Any(), "/home/coder/foo.go", gomock.Any()).
			DoAndReturn(func(_ context.Context, _ string, reader io.Reader) error {
				data, err := io.ReadAll(reader)
				require.NoError(t, err)
				assert.Equal(t, "package main", string(data))
				return nil
			})

		tool := chattool.WriteFile(chattool.WriteFileOptions{
			GetWorkspaceConn: func(context.Context) (workspacesdk.AgentConn, error) {
				return mockConn, nil
			},
		})

		resp, err := tool.Run(context.Background(), fantasy.ToolCall{
			ID:    "call-1",
			Name:  "write_file",
			Input: `{"path":"/home/coder/foo.go","content":"package main"}`,
		})
		require.NoError(t, err)
		assertWriteFileOK(t, resp)
	})
}

func assertWriteFileOK(t *testing.T, resp fantasy.ToolResponse) {
	t.Helper()
	assert.False(t, resp.IsError)

	var result map[string]bool
	require.NoError(t, json.Unmarshal([]byte(resp.Content), &result))
	assert.Equal(t, map[string]bool{"ok": true}, result)
}
