import fs from 'fs';
import path from 'path';

async function getPublicFiles() {
  const publicDir = path.join(process.cwd(), 'public');
  const files = fs.readdirSync(publicDir);
  
  return files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.html', '.htm'].includes(ext);
    })
    .map(file => ({
      name: file,
      displayName: file.replace(/\.(html|htm)$/i, '').replace(/[-_]/g, ' '),
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export default async function Home() {
  const files = await getPublicFiles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent mb-3">
            File Gallery
          </h1>
          <p className="text-zinc-400 text-lg">
            {files.length} {files.length === 1 ? 'file' : 'files'} available
          </p>
        </header>

        {/* File Grid */}
        {files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <a
                key={file.name}
                href={`/${file.name}`}
                className="group relative overflow-hidden rounded-2xl bg-zinc-800/50 border border-zinc-700/50 p-6 transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-zinc-900/50"
              >
                {/* Icon */}
                <div className="mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-purple-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                {/* Title */}
                <h2 className="font-semibold text-lg text-zinc-100 capitalize mb-1 group-hover:text-white transition-colors">
                  {file.displayName}
                </h2>
                
                {/* Filename */}
                <p className="text-sm text-zinc-500 font-mono truncate">
                  {file.name}
                </p>

                {/* Arrow indicator */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-zinc-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-zinc-400 mb-2">No HTML files yet</h2>
            <p className="text-zinc-600">Add .html files to the <code className="bg-zinc-800 px-2 py-1 rounded">public</code> folder</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-zinc-800 text-center text-zinc-600 text-sm">
          Drop HTML files in <code className="bg-zinc-800 px-2 py-1 rounded text-zinc-400">public/</code> — they'll appear here automatically
        </footer>
      </div>
    </div>
  );
}
