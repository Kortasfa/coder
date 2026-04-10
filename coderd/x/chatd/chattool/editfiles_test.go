package chattool_test

import (
	"context"
	"encoding/json"
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

func TestEditFilesPlanTurn(t *testing.T) {
	t.Parallel()

	canonicalFiles := []workspacesdk.FileEdits{{
		Path: "/home/coder/PLAN.md",
		Edits: []workspacesdk.FileEdit{{
			Search:  "old",
			Replace: "new",
		}},
	}}

	t.Run("PlanTurnAllowsCanonicalPath", func(t *testing.T) {
		t.Parallel()
		ctrl := gomock.NewController(t)
		mockConn := agentconnmock.NewMockAgentConn(ctrl)

		mockConn.EXPECT().
			EditFiles(gomock.Any(), workspacesdk.FileEditRequest{Files: canonicalFiles}).
			Return(nil)

		tool := chattool.EditFiles(chattool.EditFilesOptions{
			GetWorkspaceConn: func(context.Context) (workspacesdk.AgentConn, error) {
				return mockConn, nil
			},
			IsPlanTurn: true,
		})

		resp, err := tool.Run(context.Background(), fantasy.ToolCall{
			ID:    "call-1",
			Name:  "edit_files",
			Input: `{"files":[{"path":"/home/coder/PLAN.md","edits":[{"search":"old","replace":"new"}]}]}`,
		})
		require.NoError(t, err)
		assertEditFilesOK(t, resp)
	})

	t.Run("PlanTurnRejectsNonCanonicalPath", func(t *testing.T) {
		t.Parallel()
		getWorkspaceConnCalled := false
		tool := chattool.EditFiles(chattool.EditFilesOptions{
			GetWorkspaceConn: func(context.Context) (workspacesdk.AgentConn, error) {
				getWorkspaceConnCalled = true
				return nil, xerrors.New("should not resolve workspace connection")
			},
			IsPlanTurn: true,
		})

		resp, err := tool.Run(context.Background(), fantasy.ToolCall{
			ID:    "call-1",
			Name:  "edit_files",
			Input: `{"files":[{"path":"/home/coder/foo.go","edits":[{"search":"old","replace":"new"}]}]}`,
		})
		require.NoError(t, err)
		assert.True(t, resp.IsError)
		assert.Contains(t, resp.Content, "during plan turns, edit_files is restricted to /home/coder/PLAN.md")
		assert.False(t, getWorkspaceConnCalled)
	})

	t.Run("PlanTurnRejectsMixedPaths", func(t *testing.T) {
		t.Parallel()
		getWorkspaceConnCalled := false
		tool := chattool.EditFiles(chattool.EditFilesOptions{
			GetWorkspaceConn: func(context.Context) (workspacesdk.AgentConn, error) {
				getWorkspaceConnCalled = true
				return nil, xerrors.New("should not resolve workspace connection")
			},
			IsPlanTurn: true,
		})

		resp, err := tool.Run(context.Background(), fantasy.ToolCall{
			ID:   "call-1",
			Name: "edit_files",
			Input: `{"files":[` +
				`{"path":"/home/coder/PLAN.md","edits":[{"search":"old","replace":"new"}]},` +
				`{"path":"/home/coder/foo.go","edits":[{"search":"old","replace":"new"}]}` +
				`]}`,
		})
		require.NoError(t, err)
		assert.True(t, resp.IsError)
		assert.Contains(t, resp.Content, "during plan turns, edit_files is restricted to /home/coder/PLAN.md")
		assert.False(t, getWorkspaceConnCalled)
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

		tool := chattool.EditFiles(chattool.EditFilesOptions{
			GetWorkspaceConn: func(context.Context) (workspacesdk.AgentConn, error) {
				return mockConn, nil
			},
		})

		resp, err := tool.Run(context.Background(), fantasy.ToolCall{
			ID:    "call-1",
			Name:  "edit_files",
			Input: `{"files":[{"path":"/home/coder/foo.go","edits":[{"search":"old","replace":"new"}]}]}`,
		})
		require.NoError(t, err)
		assertEditFilesOK(t, resp)
	})
}

func assertEditFilesOK(t *testing.T, resp fantasy.ToolResponse) {
	t.Helper()
	assert.False(t, resp.IsError)

	var result map[string]bool
	require.NoError(t, json.Unmarshal([]byte(resp.Content), &result))
	assert.Equal(t, map[string]bool{"ok": true}, result)
}
