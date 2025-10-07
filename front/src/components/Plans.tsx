import React from 'react';
import { Plan } from '../types';

interface PlansProps {
    plans: Plan[];
    onPlanSelect: (plan: Plan) => void;
}

export const Plans: React.FC<PlansProps> = ({ plans, onPlanSelect }) => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Escolha seu novo plano</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map(plan => (
                    <div key={plan.id} className="border p-4 rounded-lg flex flex-col">
                        <h2 className="text-xl font-semibold">{plan.name}</h2>
                        <p className="text-3xl font-bold my-2">R$ {plan.price}</p>
                        <div className="flex-grow">
                            <p>{plan.storage} GB de Armazenamento</p>
                            <p>{plan.quotas} Cotas</p>
                        </div>
                        <button 
                            onClick={() => onPlanSelect(plan)}
                            className="mt-4 w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                        >
                            Selecionar Plano
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};