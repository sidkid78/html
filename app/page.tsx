import fs from 'fs';
import path from 'path';

interface FileInfo {
  name: string;
  displayName: string;
  folder: string;
  folderDisplayName: string;
  href: string;
}

async function getPublicFiles(): Promise<{ folders: string[]; filesByFolder: Record<string, FileInfo[]>; totalCount: number }> {
  const publicDir = path.join(process.cwd(), 'public');
  const items = fs.readdirSync(publicDir, { withFileTypes: true });

  const allFiles: FileInfo[] = [];

  // Scan subdirectories for HTML files
  for (const item of items) {
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'images') {
      const folderPath = path.join(publicDir, item.name);
      const folderFiles = fs.readdirSync(folderPath);

      for (const file of folderFiles) {
        const ext = path.extname(file).toLowerCase();
        if (['.html', '.htm'].includes(ext)) {
          allFiles.push({
            name: file,
            displayName: file.replace(/\.(html|htm)$/i, '').replace(/[-_]/g, ' '),
            folder: item.name,
            folderDisplayName: item.name.replace(/[-_]/g, ' '),
            href: `/${item.name}/${file}`,
          });
        }
      }
    }
  }

  // Also check root level for any remaining HTML files
  for (const item of items) {
    if (!item.isDirectory()) {
      const ext = path.extname(item.name).toLowerCase();
      if (['.html', '.htm'].includes(ext)) {
        allFiles.push({
          name: item.name,
          displayName: item.name.replace(/\.(html|htm)$/i, '').replace(/[-_]/g, ' '),
          folder: '',
          folderDisplayName: 'Other',
          href: `/${item.name}`,
        });
      }
    }
  }

  // Group by folder
  const filesByFolder: Record<string, FileInfo[]> = {};
  for (const file of allFiles) {
    const key = file.folder || '_root';
    if (!filesByFolder[key]) {
      filesByFolder[key] = [];
    }
    filesByFolder[key].push(file);
  }

  // Sort files within each folder
  for (const key of Object.keys(filesByFolder)) {
    filesByFolder[key].sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  // Get sorted folder names (with custom order)
  const folderOrder = ['agentic-ai', 'senior-care', 'social-media', 'kinetic-cards', 'misc', '_root'];
  const folders = Object.keys(filesByFolder).sort((a, b) => {
    const aIndex = folderOrder.indexOf(a);
    const bIndex = folderOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  return { folders, filesByFolder, totalCount: allFiles.length };
}

const folderColors: Record<string, string> = {
  'agentic-ai': 'from-blue-500 to-cyan-600',
  'senior-care': 'from-emerald-500 to-teal-600',
  'social-media': 'from-pink-500 to-rose-600',
  'kinetic-cards': 'from-amber-500 to-orange-600',
  'misc': 'from-violet-500 to-purple-600',
  '_root': 'from-zinc-500 to-zinc-600',
};

export default async function Home() {
  const { folders, filesByFolder, totalCount } = await getPublicFiles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white font-sans">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent mb-3">
            File Gallery
          </h1>
          <p className="text-zinc-400 text-lg">
            {totalCount} {totalCount === 1 ? 'file' : 'files'} across {folders.length} {folders.length === 1 ? 'folder' : 'folders'}
          </p>
        </header>

        {/* Files by Folder */}
        {totalCount > 0 ? (
          <div className="space-y-12">
            {folders.map((folder) => {
              const files = filesByFolder[folder];
              const folderName = folder === '_root' ? 'Other' : folder.replace(/[-_]/g, ' ');
              const colorClass = folderColors[folder] || 'from-blue-500 to-purple-600';

              return (
                <section key={folder}>
                  {/* Folder Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-100 capitalize">{folderName}</h2>
                      <p className="text-sm text-zinc-500">{files.length} {files.length === 1 ? 'file' : 'files'}</p>
                    </div>
                  </div>

                  {/* File Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {files.map((file) => (
                      <a
                        key={file.href}
                        href={file.href}
                        className="group relative overflow-hidden rounded-2xl bg-zinc-800/50 border border-zinc-700/50 p-5 transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-zinc-900/50"
                      >
                        {/* Icon */}
                        <div className={`mb-3 w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-zinc-100 capitalize mb-1 group-hover:text-white transition-colors line-clamp-2">
                          {file.displayName}
                        </h3>

                        {/* Filename */}
                        <p className="text-xs text-zinc-500 font-mono truncate">
                          {file.name}
                        </p>

                        {/* Arrow indicator */}
                        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-zinc-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-zinc-400 mb-2">No HTML files yet</h2>
            <p className="text-zinc-600">Add .html files to subfolders in <code className="bg-zinc-800 px-2 py-1 rounded">public/</code></p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-zinc-800 text-center text-zinc-600 text-sm">
          Organize HTML files in <code className="bg-zinc-800 px-2 py-1 rounded text-zinc-400">public/</code> subfolders — they'll appear here automatically
        </footer>
      </div>
    </div>
  );
}
