package chattool_test

import (
	"context"
	"testing"

	"charm.land/fantasy"
	"github.com/stretchr/testify/require"
	"go.uber.org/mock/gomock"

	"github.com/coder/coder/v2/coderd/x/chatd/chattool"
	"github.com/coder/coder/v2/codersdk/workspacesdk"
	"github.com/coder/coder/v2/codersdk/workspacesdk/agentconnmock"
)

func TestEditFilesPlanTurn(t *testing.T) {
	t.Parallel()

	canonicalFiles := []workspacesdk.FileEdits{{
		Path: "/home/coder/PLAN.md",
		Edits: []workspacesdk.FileEdit{{
			Search:  "old",
			Replace: "new",
		}},
	}}
	newTool := func(
		getWorkspaceConn func(context.Context) (workspacesdk.AgentConn, error),
		isPlanTurn bool,
	) fantasy.AgentTool {
		return chattool.EditFiles(chattool.EditFilesOptions{
			GetWorkspaceConn: getWorkspaceConn,
			IsPlanTurn:       isPlanTurn,
		})
	}

	t.Run("PlanTurnAllowsCanonicalPath", func(t *testing.T) {
		t.Parallel()
		ctrl := gomock.NewController(t)
		mockConn := agentconnmock.NewMockAgentConn(ctrl)

		mockConn.EXPECT().
			EditFiles(gomock.Any(), workspacesdk.FileEditRequest{Files: canonicalFiles}).
			Return(nil)

		tool := newTool(func(context.Context) (workspacesdk.AgentConn, error) {
			return mockConn, nil
		}, true)

		resp, err := tool.Run(context.Background(), fantasy.ToolCall{
			ID:    "call-1",
			Name:  "edit_files",
			Input: `{"files":[{"path":"/home/coder/PLAN.md","edits":[{"search":"old","replace":"new"}]}]}`,
		})
		require.NoError(t, err)
		assertToolOK(t, resp)
	})

	t.Run("PlanTurnRejectsNonCanonicalPath", func(t *testing.T) {
		t.Parallel()
		assertPlanTurnPathRejected(
			t,
			newTool,
			`{"files":[{"path":"/home/coder/foo.go","edits":[{"search":"old","replace":"new"}]}]}`,
			"during plan turns, edit_files is restricted to /home/coder/PLAN.md",
		)
	})

	t.Run("PlanTurnRejectsMixedPaths", func(t *testing.T) {
		t.Parallel()
		assertPlanTurnPathRejected(
			t,
			newTool,
			`{"files":[`+
				`{"path":"/home/coder/PLAN.md","edits":[{"search":"old","replace":"new"}]},`+
				`{"path":"/home/coder/foo.go","edits":[{"search":"old","replace":"new"}]}`+
				`]}`,
			"during plan turns, edit_files is restricted to /home/coder/PLAN.md",
		)
	})

	t.Run("NonPlanTurnAllowsAnyPaths", func(t *testing.T) {
		t.Parallel()
		ctrl := gomock.NewController(t)
		mockConn := agentconnmock.NewMockAgentConn(ctrl)
		files := []workspacesdk.FileEdits{{
			Path: "/home/coder/foo.go",
			Edits: []workspacesdk.FileEdit{{
				Search:  "old",
				Replace: "new",
			}},
		}}

		mockConn.EXPECT().
			EditFiles(gomock.Any(), workspacesdk.FileEditRequest{Files: files}).
			Return(nil)

		tool := newTool(func(context.Context) (workspacesdk.AgentConn, error) {
			return mockConn, nil
		}, false)

		resp, err := tool.Run(context.Background(), fantasy.ToolCall{
			ID:    "call-1",
			Name:  "edit_files",
			Input: `{"files":[{"path":"/home/coder/foo.go","edits":[{"search":"old","replace":"new"}]}]}`,
		})
		require.NoError(t, err)
		assertToolOK(t, resp)
	})
}
