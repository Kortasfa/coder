package chattool_test

import (
	"context"
	"io"
	"testing"

	"charm.land/fantasy"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.uber.org/mock/gomock"

	"github.com/coder/coder/v2/coderd/x/chatd/chattool"
	"github.com/coder/coder/v2/codersdk/workspacesdk"
	"github.com/coder/coder/v2/codersdk/workspacesdk/agentconnmock"
)

func TestWriteFilePlanTurn(t *testing.T) {
	t.Parallel()

	newTool := func(
		getWorkspaceConn func(context.Context) (workspacesdk.AgentConn, error),
		isPlanTurn bool,
	) fantasy.AgentTool {
		return chattool.WriteFile(chattool.WriteFileOptions{
			GetWorkspaceConn: getWorkspaceConn,
			IsPlanTurn:       isPlanTurn,
		})
	}

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

		tool := newTool(func(context.Context) (workspacesdk.AgentConn, error) {
			return mockConn, nil
		}, true)

		resp, err := tool.Run(context.Background(), fantasy.ToolCall{
			ID:    "call-1",
			Name:  "write_file",
			Input: `{"path":"/home/coder/PLAN.md","content":"# Plan"}`,
		})
		require.NoError(t, err)
		assertToolOK(t, resp)
	})

	t.Run("PlanTurnRejectsNonCanonicalPath", func(t *testing.T) {
		t.Parallel()
		assertPlanTurnPathRejected(
			t,
			newTool,
			`{"path":"/home/coder/foo.go","content":"package main"}`,
			"during plan turns, write_file is restricted to /home/coder/PLAN.md",
		)
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

		tool := newTool(func(context.Context) (workspacesdk.AgentConn, error) {
			return mockConn, nil
		}, false)

		resp, err := tool.Run(context.Background(), fantasy.ToolCall{
			ID:    "call-1",
			Name:  "write_file",
			Input: `{"path":"/home/coder/foo.go","content":"package main"}`,
		})
		require.NoError(t, err)
		assertToolOK(t, resp)
	})
}
