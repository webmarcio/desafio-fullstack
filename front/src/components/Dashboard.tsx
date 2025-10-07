import React from 'react';
import { User } from '../types';

interface DashboardProps {
    user: User;
    onInitiateChangePlan: () => void;
    onShowHistory: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onInitiateChangePlan, onShowHistory }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Meu Plano</h1>
                <button onClick={onShowHistory} className="text-sm text-blue-600 hover:underline">Ver Histórico</button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-lg">Plano: <span className="font-semibold">{user.active_contract?.plan.name}</span></p>
                <p className="text-lg">Preço Mensal: <span className="font-semibold">R$ {user.active_contract?.plan.price}</span></p>
                <button 
                    onClick={onInitiateChangePlan}
                    className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                    Trocar de Plano
                </button>
            </div>
        </div>
    );
};