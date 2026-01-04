import { useState } from 'react';
import Calculator from './components/Calculator';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';

type Page = 'calculator' | 'privacy' | 'terms';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('calculator');

  const renderPage = () => {
    switch (currentPage) {
      case 'calculator':
        return <Calculator />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfUse />;
      default:
        return <Calculator />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}

      {currentPage !== 'calculator' && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setCurrentPage('calculator')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors font-semibold"
          >
            ← Към калкулатора
          </button>
        </div>
      )}

      {currentPage === 'calculator' && (
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">© 2026 Калкулатор за ресто. Всички права запазени.</p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => setCurrentPage('privacy')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Политика за поверителност
                </button>
                <button
                  onClick={() => setCurrentPage('terms')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Общи условия за ползване
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
