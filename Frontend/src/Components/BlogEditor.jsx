import { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

function BlogEditor({onInit,savedDraft}) {
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (!editor) return;

    const syncTheme = () => {
      const themeStyles = getComputedStyle(document.documentElement);
      const editorRoot = editor.getDoc().documentElement;
      const theme = document.documentElement.dataset.theme;

      editorRoot.style.colorScheme = theme === 'light' ? 'light' : 'dark';
      editorRoot.style.setProperty('--editor-bg', themeStyles.getPropertyValue('--bg-primary').trim());
      editorRoot.style.setProperty('--editor-text', themeStyles.getPropertyValue('--text-primary').trim());
      editorRoot.style.setProperty('--editor-muted', themeStyles.getPropertyValue('--text-secondary').trim());
      editorRoot.style.setProperty('--editor-accent', themeStyles.getPropertyValue('--accent-secondary').trim());
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, [editor]);

  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      onInit={(_event, instance) => {
        setEditor(instance);
        onInit?.(instance);
      }}
      initialValue={savedDraft || "<p>Replace me with your thoughts !!</p>"}
      init={{
        height: 500,
        menubar: false,
        statusbar: true,
        branding: false,
        promotion: false,
        resize: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'preview', 'wordcount',
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat',
        content_style: `
          :root { color-scheme: dark; }
          body {
            margin: 0;
            padding: 16px;
            background: var(--editor-bg, #0a0a0f);
            color: var(--editor-text, #f0f0f5);
            font-family: Inter, sans-serif;
            font-size: 15px;
            line-height: 1.7;
          }
          a { color: var(--editor-accent, #a855f7); }
          blockquote { border-left: 3px solid var(--editor-accent, #a855f7); color: var(--editor-muted, #8888a0); }
          ::selection { background: var(--editor-accent, #a855f7); color: #fff; }
        `,
      }}
    />
  );
}

export default BlogEditor;