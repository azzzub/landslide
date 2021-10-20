<?php

namespace App\Http\Controllers;

use App\Models\Trigger;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * GET - /trigger
     * Getting the trigger parameters
     * 
     * Header:
     * 1. X-Auth-Landslide
     */
    public function getTrigger()
    {
        $trigger = Trigger::where('id', 1)->first();
        return $trigger;
    }

    /**
     * PUT - /trigger
     * Update the trigger parameters
     * 
     * Header:
     * 1. X-Auth-Landslide
     * 
     * Body:
     * 1. soil - float
     * 2. extenso - float
     * 3. gyro_x - float
     * 4. gyro_y - float
     * 5. time - integer
     * 6. active - boolean
     */
    public function updateTrigger(Request $request)
    {
        $this->validate($request, [
            'soil' => 'required|numeric',
            'extenso' => 'required|numeric',
            'gyro_x' => 'required|numeric',
            'gyro_y' => 'required|numeric',
            'time' => 'required|numeric',
            'active' => 'required|boolean',
        ]);

        $soil = $request->input('soil');
        $extenso = $request->input('extenso');
        $gyroX = $request->input('gyro_x');
        $gyroY = $request->input('gyro_y');
        $active = $request->input('active');
        $time = $request->input('time');

        $trigger = Trigger::where('id', 1)->first();

        $trigger->update([
            's' => $soil,
            'e' => $extenso,
            'x' => $gyroX,
            'y' => $gyroY,
            'active' => $active,
            'time' => $time,
        ]);

        return [
            "message" => "Data berhasil diperbarui",
            "status_code" => 200,
            "data" => $trigger
        ];
    }

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
        //
    }

    //
}
