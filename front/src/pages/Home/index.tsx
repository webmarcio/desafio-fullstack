import { useEffect, useState } from 'react';
import { getUser, getPlans, subscribeToPlan, changePlan } from '../../services/api';
import { User, Plan } from '../../types';
import { PixScreen } from '../../components/PixScreen';
import { History } from '../../components/History';
import { Dashboard } from '../../components/Dashboard';
import { Plans } from '../../components/Plans';

export const Home = () => {
    const [user, setUser] = useState<User | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isChangingPlan, setIsChangingPlan] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [pixAmount, setPixAmount] = useState(0);
    const [showHistory, setShowHistory] = useState(false);
    const [proRataMessage, setProRataMessage] = useState<string | null>(null);

    const fetchUserData = async () => {
        try {
            const userData = await getUser();
            setUser(userData);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [userData, plansData] = await Promise.all([
                    getUser(),
                    getPlans(),
                ]);
                setUser(userData);
                setPlans(plansData);
            } catch (error) {
                console.error("Erro ao buscar dados iniciais:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handlePlanSelection = (plan: Plan) => {
        if (user?.active_contract?.plan_id === plan.id) {
            alert("Você já está neste plano.");
            return;
        }

        if (user?.active_contract) {
            const oldPlan = user.active_contract.plan;
            const startDate = new Date(user.active_contract.start_date);
            const today = new Date();
            const timeDiff = today.getTime() - startDate.getTime();
            const daysUsed = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
            
            const daysInMonth = 30;
            const oldPlanPrice = parseFloat(oldPlan.price.toString());
            const dailyRate = oldPlanPrice / daysInMonth;
            const unusedAmount = oldPlanPrice - (daysUsed * dailyRate);
            const credit = unusedAmount > 0 ? unusedAmount : 0;
            
            const newPlanPrice = parseFloat(plan.price.toString());
            const finalAmount = newPlanPrice - credit;
            setPixAmount(finalAmount > 0 ? finalAmount : 0);

            setProRataMessage(
                `Você receberá um crédito de R$ ${credit.toFixed(2)} do seu plano anterior. ` +
                `O valor ajustado para este pagamento será de R$ ${finalAmount.toFixed(2)}.`
            );
        } else {
            setPixAmount(parseFloat(plan.price.toString()));
            setProRataMessage(null);
        }

        setSelectedPlan(plan);
    };

    const handleConfirmPayment = async () => {
        if (!selectedPlan) return;

        setLoading(true);
        try {
            if (user?.active_contract) {
                await changePlan(selectedPlan.id);
            } else {
                await subscribeToPlan(selectedPlan.id);
            }
            
            setSelectedPlan(null);
            setIsChangingPlan(false);
            setProRataMessage(null); // Clear message after payment
            await fetchUserData();
        } catch (error) {
            console.error("Erro ao processar pagamento:", error);
            alert("Não foi possível processar sua solicitação. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return <div className="text-center p-8">Carregando...</div>;
        }

        if (!user) {
            return <div className="text-center p-8 text-red-500">Erro ao carregar dados do usuário.</div>;
        }

        const hasActiveContract = !!user.active_contract;

        if (hasActiveContract && !isChangingPlan) {
            if (showHistory) {
                return <History onClose={() => setShowHistory(false)} />;
            }
            return <Dashboard user={user} onInitiateChangePlan={() => setIsChangingPlan(true)} onShowHistory={() => setShowHistory(true)} />;
        }
        
        return <Plans plans={plans} onPlanSelect={handlePlanSelection} />;
    }

    return (
        <div className="container mx-auto p-8">
            {selectedPlan && (
                <PixScreen 
                    planName={selectedPlan.name}
                    planPrice={pixAmount}
                    proRataMessage={proRataMessage}
                    onConfirm={handleConfirmPayment}
                    onCancel={() => setSelectedPlan(null)}
                />
            )}

            <h1 className="text-3xl font-bold text-orange-500 mb-6">Olá, {user?.name}!</h1>
            
            {renderContent()}
        </div>
    );
}