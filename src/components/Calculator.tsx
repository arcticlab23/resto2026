import { useState, useEffect, useRef } from 'react';

const EXCHANGE_RATE = 1.95583;

interface CalculatorState {
  priceEUR: string;
  paidEUR: string;
  paidBGN: string;
  returnedEUR: string;
  returnedBGN: string;
}

interface History {
  state: CalculatorState;
}

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>({
    priceEUR: '',
    paidEUR: '',
    paidBGN: '',
    returnedEUR: '',
    returnedBGN: '',
  });

  const [history, setHistory] = useState<History[]>([]);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const parseNumber = (value: string): number => {
    if (!value || value === '') return 0;
    const cleaned = value.replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const formatCurrency = (value: number): string => {
    if (value === 0) return '0.00';
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleInputChange = (field: keyof CalculatorState, value: string) => {
    if (value && !/^\d*\.?\d*$/.test(value.replace(',', '.'))) return;

    setHistory([...history, { state }]);
    setState({ ...state, [field]: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentField: string) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setState({ ...state, [currentField]: '' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const fields = ['priceEUR', 'paidEUR', 'paidBGN', 'returnedEUR', 'returnedBGN'];
      const currentIndex = fields.indexOf(currentField);
      if (currentIndex < fields.length - 1) {
        inputRefs.current[fields[currentIndex + 1]]?.focus();
      }
    }
  };

  const handleDoubleClick = (field: keyof CalculatorState) => {
    setState({ ...state, [field]: '' });
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z' && history.length > 0) {
        e.preventDefault();
        const lastState = history[history.length - 1];
        setState(lastState.state);
        setHistory(history.slice(0, -1));
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [history]);

  const priceEUR = parseNumber(state.priceEUR);
  const paidEUR = parseNumber(state.paidEUR);
  const paidBGN = parseNumber(state.paidBGN);
  const returnedEUR = parseNumber(state.returnedEUR);
  const returnedBGN = parseNumber(state.returnedBGN);

  const paidBGNInEUR = paidBGN / EXCHANGE_RATE;
  const returnedBGNInEUR = returnedBGN / EXCHANGE_RATE;

  const totalPaidEUR = paidEUR + paidBGNInEUR;
  const totalChangeEUR = totalPaidEUR - priceEUR;
  const totalReturnedEUR = returnedEUR + returnedBGNInEUR;
  const remainingChangeEUR = totalChangeEUR - totalReturnedEUR;
  const remainingChangeBGN = remainingChangeEUR * EXCHANGE_RATE;

  const isActivated = paidEUR > 0 || paidBGN > 0 || returnedEUR > 0 || returnedBGN > 0;

  const getBalanceMessage = () => {
    if (!isActivated) return null;

    if (Math.abs(remainingChangeEUR) < 0.01) {
      return <div className="text-center text-xl font-bold text-green-600 mt-4">Балансът е точен</div>;
    }

    if (totalPaidEUR >= priceEUR && remainingChangeEUR < 0) {
      return <div className="text-center text-xl font-bold text-red-600 bg-red-100 p-3 rounded mt-4">Върнато е повече от нужното</div>;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Калкулатор за ресто 2026</h1>
            <div className="text-sm text-gray-600">Курс: 1€ = 1.95583лв</div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Данни за плащане</h2>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Крайна цена:</label>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold text-lg">€</span>
                  <input
                    ref={(el) => inputRefs.current['priceEUR'] = el}
                    type="text"
                    value={state.priceEUR}
                    onChange={(e) => handleInputChange('priceEUR', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'priceEUR')}
                    onDoubleClick={() => handleDoubleClick('priceEUR')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Платена сума от клиента/пациента:</label>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-600 font-bold text-lg">€</span>
                  <input
                    ref={(el) => inputRefs.current['paidEUR'] = el}
                    type="text"
                    value={state.paidEUR}
                    onChange={(e) => handleInputChange('paidEUR', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'paidEUR')}
                    onDoubleClick={() => handleDoubleClick('paidEUR')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-green-700 font-bold text-lg">лв</span>
                  <input
                    ref={(el) => inputRefs.current['paidBGN'] = el}
                    type="text"
                    value={state.paidBGN}
                    onChange={(e) => handleInputChange('paidBGN', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'paidBGN')}
                    onDoubleClick={() => handleDoubleClick('paidBGN')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {!isActivated && (
                <div className="mt-6 text-sm text-gray-500 italic">Въведете данни за плащане</div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Вече върнато ресто</h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Върнато в €</label>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold text-lg">€</span>
                  <input
                    ref={(el) => inputRefs.current['returnedEUR'] = el}
                    type="text"
                    value={state.returnedEUR}
                    onChange={(e) => handleInputChange('returnedEUR', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'returnedEUR')}
                    onDoubleClick={() => handleDoubleClick('returnedEUR')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Върнато в лв</label>
                <div className="flex items-center gap-2">
                  <span className="text-green-700 font-bold text-lg">лв</span>
                  <input
                    ref={(el) => inputRefs.current['returnedBGN'] = el}
                    type="text"
                    value={state.returnedBGN}
                    onChange={(e) => handleInputChange('returnedBGN', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'returnedBGN')}
                    onDoubleClick={() => handleDoubleClick('returnedBGN')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Оставащо ресто за връщане</h2>

              {isActivated ? (
                <>
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Остава да се върне в €:</div>
                    <div className="text-4xl font-mono font-bold text-blue-600">
                      € {formatCurrency(remainingChangeEUR)}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Остава да се върне в лв:</div>
                    <div className="text-4xl font-mono font-bold text-green-700">
                      {formatCurrency(remainingChangeBGN)} лв
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Платено общо: <span className="text-blue-600 font-mono">€ {formatCurrency(totalPaidEUR)}</span></div>
                      <div>Ресто общо: <span className="text-blue-600 font-mono">€ {formatCurrency(totalChangeEUR)}</span></div>
                      <div>Вече върнато: <span className="text-blue-600 font-mono">€ {formatCurrency(totalReturnedEUR)}</span></div>
                    </div>
                  </div>

                  {getBalanceMessage()}
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm"></div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Клавиши: Tab/Enter (навигация) • ESC (изчисти поле) • Double-click (изчисти) • Ctrl+Z (назад)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
