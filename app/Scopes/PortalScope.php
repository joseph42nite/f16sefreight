<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class PortalScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $builder
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function apply(Builder $builder, Model $model)
    {
        if (session()->has('active_portal_scope')) {
            $builder->where($model->getTable() . '.transport_mode', session('active_portal_scope'));
        } else {
            // Default to 'air' if not running in console
            if (!app()->runningInConsole()) {
                $builder->where($model->getTable() . '.transport_mode', 'air');
            }
        }
    }
}
