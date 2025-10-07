<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Plan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContractController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan_id' => 'required|exists:plans,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::first();
        if (!$user) {
            return response()->json(['message' => 'Nenhum usuário encontrado.'], 404);
        }

        $activeContract = $user->contracts()->where('status', 'active')->first();
        if ($activeContract) {
            return response()->json(['message' => 'Usuário já possui um contrato ativo.'], 409);
        }

        $plan = Plan::find($request->input('plan_id'));

        $contract = Contract::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'start_date' => Carbon::now(),
            'status' => 'active',
        ]);

        $contract->payments()->create([
            'amount' => $plan->price,
            'payment_date' => Carbon::now(),
            'status' => 'paid',
        ]);

        return response()->json($contract->load('plan'), 201);
    }

    public function changePlan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan_id' => 'required|exists:plans,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::first();
        if (!$user) {
            return response()->json(['message' => 'Nenhum usuário encontrado.'], 404);
        }

        $activeContract = $user->contracts()->where('status', 'active')->with('plan')->first();
        if (!$activeContract) {
            return response()->json(['message' => 'Nenhum contrato ativo encontrado para troca.'], 404);
        }

        $newPlan = Plan::find($request->input('plan_id'));
        if ($activeContract->plan_id == $newPlan->id) {
            return response()->json(['message' => 'Você já está neste plano.'], 409);
        }

        // Pro-rata calculation
        $oldPlan = $activeContract->plan;
        $daysInMonth = 30;
        $daysUsed = $activeContract->start_date->diffInDays(Carbon::now());
        $dailyRate = $oldPlan->price / $daysInMonth;
        $unusedAmount = $oldPlan->price - ($daysUsed * $dailyRate);
        $credit = $unusedAmount > 0 ? $unusedAmount : 0;

        // Deactivate old contract
        $activeContract->update([
            'status' => 'inactive',
            'end_date' => Carbon::now(),
        ]);

        // Create new contract
        $newContract = Contract::create([
            'user_id' => $user->id,
            'plan_id' => $newPlan->id,
            'start_date' => Carbon::now(),
            'status' => 'active',
        ]);

        // Create new payment
        $firstPaymentAmount = $newPlan->price - $credit;
        $newContract->payments()->create([
            'amount' => $firstPaymentAmount > 0 ? $firstPaymentAmount : 0,
            'payment_date' => Carbon::now(),
            'status' => 'paid',
        ]);

        return response()->json($newContract->load('plan'), 201);
    }

    public function history()
    {
        $user = User::first();
        if (!$user) {
            return response()->json(['message' => 'Nenhum usuário encontrado.'], 404);
        }

        $history = $user->contracts()->with('plan', 'payments')->orderBy('start_date', 'desc')->get();

        return response()->json($history);
    }
}
