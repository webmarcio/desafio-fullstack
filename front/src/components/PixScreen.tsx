import React from 'react';

interface PixScreenProps {
    planName: string;
    planPrice: number;
    proRataMessage?: string | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export const PixScreen: React.FC<PixScreenProps> = ({ planName, planPrice, proRataMessage, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm">
                <h2 className="text-2xl font-bold mb-2">Pagamento PIX</h2>
                <p className="mb-4">Você está assinando o plano <strong>{planName}</strong>.</p>
                
                {proRataMessage && (
                    <p className="text-sm text-gray-700 mb-2">{proRataMessage}</p>
                )}

                <div className="bg-gray-100 p-4 my-4 rounded-lg">
                    <p className="text-lg">Valor a pagar:</p>
                    <p className="text-4xl font-bold text-orange-500">R$ {planPrice.toFixed(2)}</p>
                </div>

                <p className="text-sm text-gray-600">Simulação: escaneie o QR Code abaixo.</p>
                <div className="w-48 h-48 bg-gray-800 mx-auto my-4 flex items-center justify-center text-white">
                    [ Fake QR Code ]
                </div>

                <div className="flex justify-between mt-6">
                    <button 
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                    >
                        Confirmar Pagamento
                    </button>
                </div>
            </div>
        </div>
    );
};
