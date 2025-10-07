<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }
}
