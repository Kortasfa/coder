//nolint:testpackage // Internal tests for secret injection.
package agent

import (
	"testing"

	"github.com/spf13/afero"
	"github.com/stretchr/testify/require"

	"cdr.dev/slog/v3/sloggers/slogtest"
	"github.com/coder/coder/v2/codersdk/agentsdk"
	"github.com/coder/coder/v2/testutil"
)

func TestWriteSecretFiles(t *testing.T) {
	t.Parallel()

	t.Run("AbsolutePath", func(t *testing.T) {
		t.Parallel()
		fs := afero.NewMemMapFs()
		ctx := testutil.Context(t, testutil.WaitShort)
		logger := slogtest.Make(t, nil)

		writeSecretFiles(ctx, logger, fs, "/home/coder", []agentsdk.WorkspaceSecret{
			{FilePath: "/etc/myapp/config.json", Value: []byte(`{"key":"val"}`)},
		})

		content, err := afero.ReadFile(fs, "/etc/myapp/config.json")
		require.NoError(t, err)
		require.Equal(t, `{"key":"val"}`, string(content))
	})

	t.Run("TildePath", func(t *testing.T) {
		t.Parallel()
		fs := afero.NewMemMapFs()
		ctx := testutil.Context(t, testutil.WaitShort)
		logger := slogtest.Make(t, nil)

		writeSecretFiles(ctx, logger, fs, "/home/coder", []agentsdk.WorkspaceSecret{
			{FilePath: "~/.ssh/id_rsa", Value: []byte("private-key")},
		})

		content, err := afero.ReadFile(fs, "/home/coder/.ssh/id_rsa")
		require.NoError(t, err)
		require.Equal(t, "private-key", string(content))
	})

	t.Run("TildePathNoHomeDir", func(t *testing.T) {
		t.Parallel()
		fs := afero.NewMemMapFs()
		ctx := testutil.Context(t, testutil.WaitShort)
		logger := slogtest.Make(t, nil)

		writeSecretFiles(ctx, logger, fs, "", []agentsdk.WorkspaceSecret{
			{FilePath: "~/.config/token", Value: []byte("token")},
		})

		exists, err := afero.Exists(fs, "/.config/token")
		require.NoError(t, err)
		require.False(t, exists, "file should not be written when home dir is unknown")
	})

	t.Run("EmptyFilePathSkipped", func(t *testing.T) {
		t.Parallel()
		fs := afero.NewMemMapFs()
		ctx := testutil.Context(t, testutil.WaitShort)
		logger := slogtest.Make(t, nil)

		writeSecretFiles(ctx, logger, fs, "/home/coder", []agentsdk.WorkspaceSecret{
			{EnvName: "MY_TOKEN", Value: []byte("token")},
		})

		// Nothing should be written.
		empty, err := afero.IsEmpty(fs, "/")
		require.NoError(t, err)
		require.True(t, empty)
	})

	t.Run("MultipleSecrets", func(t *testing.T) {
		t.Parallel()
		fs := afero.NewMemMapFs()
		ctx := testutil.Context(t, testutil.WaitShort)
		logger := slogtest.Make(t, nil)

		writeSecretFiles(ctx, logger, fs, "/home/coder", []agentsdk.WorkspaceSecret{
			{FilePath: "/etc/secret-a", Value: []byte("aaa")},
			{FilePath: "~/.secret-b", Value: []byte("bbb")},
			{EnvName: "SKIP_ME", Value: []byte("env-only")},
		})

		a, err := afero.ReadFile(fs, "/etc/secret-a")
		require.NoError(t, err)
		require.Equal(t, "aaa", string(a))

		b, err := afero.ReadFile(fs, "/home/coder/.secret-b")
		require.NoError(t, err)
		require.Equal(t, "bbb", string(b))
	})

	t.Run("OverwritesExisting", func(t *testing.T) {
		t.Parallel()
		fs := afero.NewMemMapFs()
		ctx := testutil.Context(t, testutil.WaitShort)
		logger := slogtest.Make(t, nil)

		require.NoError(t, afero.WriteFile(fs, "/secret", []byte("old"), 0o644))

		writeSecretFiles(ctx, logger, fs, "", []agentsdk.WorkspaceSecret{
			{FilePath: "/secret", Value: []byte("new")},
		})

		content, err := afero.ReadFile(fs, "/secret")
		require.NoError(t, err)
		require.Equal(t, "new", string(content))
	})

	t.Run("EmptySlice", func(t *testing.T) {
		t.Parallel()
		fs := afero.NewMemMapFs()
		ctx := testutil.Context(t, testutil.WaitShort)
		logger := slogtest.Make(t, nil)

		writeSecretFiles(ctx, logger, fs, "/home/coder", nil)

		empty, err := afero.IsEmpty(fs, "/")
		require.NoError(t, err)
		require.True(t, empty)
	})

	t.Run("BinaryContent", func(t *testing.T) {
		t.Parallel()
		fs := afero.NewMemMapFs()
		ctx := testutil.Context(t, testutil.WaitShort)
		logger := slogtest.Make(t, nil)

		binaryData := []byte{0x00, 0x01, 0x02, 0xFF, 0xFE, 0xFD}
		writeSecretFiles(ctx, logger, fs, "", []agentsdk.WorkspaceSecret{
			{FilePath: "/cert.der", Value: binaryData},
		})

		content, err := afero.ReadFile(fs, "/cert.der")
		require.NoError(t, err)
		require.Equal(t, binaryData, content)
	})
}
