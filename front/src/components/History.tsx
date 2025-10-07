import { useEffect, useState } from "react";
import { getHistory } from "../services/api";
import { Contract } from "../types";

interface HistoryProps {
    onClose: () => void;
}

export const History = ({ onClose }: HistoryProps) => {
    const [history, setHistory] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const historyData = await getHistory();
                setHistory(historyData);
            } catch (error) {
                console.error("Erro ao buscar histórico:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Histórico de Assinaturas</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Fechar</button>
            </div>
            
            {loading ? (
                <p>Carregando histórico...</p>
            ) : (
                <div className="space-y-6">
                    {history.map(contract => (
                        <div key={contract.id} className="border rounded-lg p-4">
                            <div className={`p-2 rounded-t-lg ${contract.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                <h3 className="font-bold text-lg">{contract.plan.name}</h3>
                                <p className="text-sm text-gray-600">
                                    Contratado em: {new Date(contract.start_date).toLocaleDateString()}
                                    {contract.end_date && ` - Finalizado em: ${new Date(contract.end_date).toLocaleDateString()}`}
                                </p>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${contract.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                    {contract.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                            <div className="p-4">
                                <h4 className="font-semibold mb-2">Pagamentos:</h4>
                                <ul className="list-disc list-inside">
                                    {contract.payments.map(payment => (
                                        <li key={payment.id}>
                                            <span>R$ {payment.amount}</span> em <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
                                            <span className="text-sm text-gray-500"> ({payment.status})</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};