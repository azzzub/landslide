<?php

use App\Models\Sensor;
use App\Models\Trigger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('/register', [App\Http\Controllers\API\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\API\AuthController::class, 'login']);

//Protecting Routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/profile', function (Request $request) {
        return $request->user();
    });

    // API route for logout user
    Route::post('/logout', [App\Http\Controllers\API\AuthController::class, 'logout']);

    Route::get('/trigger', function () {
        $trigger = Trigger::where('id', 1)->first();
        return response()->json($trigger)->setEncodingOptions(JSON_NUMERIC_CHECK);
    });

    Route::put('/trigger', function (Request $request) {
        $validator = Validator::make($request->all(), [
            'soil' => 'required|numeric',
            'extenso' => 'required|numeric',
            'gyro_x' => 'required|numeric',
            'gyro_y' => 'required|numeric',
            'waterlevel' => 'required|numeric',
            'time' => 'required|numeric',
            'active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        };

        $soil = $request->input('soil');
        $extenso = $request->input('extenso');
        $gyroX = $request->input('gyro_x');
        $gyroY = $request->input('gyro_y');
        $waterLevel = $request->input('waterlevel');
        $active = $request->input('active');
        $time = $request->input('time');

        $trigger = Trigger::where('id', 1)->first();

        $trigger->update([
            's' => $soil,
            'e' => $extenso,
            'x' => $gyroX,
            'y' => $gyroY,
            'wl' => is_null($waterLevel) ? 999 : $waterLevel,
            'active' => $active,
            'time' => $time,
        ]);

        return [
            "message" => "Data berhasil diperbarui",
            "status_code" => 200,
            "data" => $trigger
        ];
    });
});

/**
 * GET - /data[/time]
 * Getting the sensor data based on the time
 * 
 * Time:
 * 1. day
 * 2. week
 * 3. month
 * 4. year
 * 5. all
 * 6. *empty* (last 1000 data)
 */
Route::get('/data/{time?}', function ($time = '') {
    global $query;
    switch ($time) {
        case 'day':
            $query = "SELECT * FROM sensor WHERE created_at >= NOW() - INTERVAL 1 DAY ORDER BY id ASC";
            break;

        case 'week':
            $query = "SELECT * FROM sensor WHERE created_at >= NOW() - INTERVAL 7 DAY ORDER BY id ASC";
            break;

        case 'month':
            $query = "SELECT * FROM sensor WHERE created_at >= NOW() - INTERVAL 30 DAY ORDER BY id ASC";
            break;

        case 'year':
            $query = "SELECT * FROM sensor WHERE created_at >= NOW() - INTERVAL 1 YEAR ORDER BY id ASC";
            break;

        case 'all':
            $query = "SELECT * FROM sensor ORDER BY id ASC";
            break;

        default:
            $query = "SELECT * FROM ( SELECT * FROM sensor ORDER BY id DESC LIMIT 1000 ) sub ORDER BY id ASC";
            break;
    }

    $result = DB::select($query);
    $final_result = array();
    foreach ($result as $row) {
        array_push($final_result, [
            // since it is an object, use -> instead of [""]
            "id" => $row->id,
            "soil" => $row->s,
            "extenso" => $row->e,
            "gyro" => [
                "x" => $row->x,
                "y" => $row->y
            ],
            "waterlevel" => $row->wl,
            "created_at" => $row->created_at,
        ]);
    }
    return response()->json($final_result)->setEncodingOptions(JSON_NUMERIC_CHECK);
});

/**
 * GET - /data4graph[/time]
 * Getting the sensor data based on the time
 * 
 * Time:
 * 1. day
 * 2. week
 * 3. month
 * 4. year
 * 5. all
 * 6. *empty* (last 1000 data)
 */
Route::get('/data4graph/{time?}', function ($time = '') {
    global $query;
    switch ($time) {
        case 'day':
            $query = "SELECT * FROM sensor WHERE created_at >= NOW() - INTERVAL 1 DAY ORDER BY id ASC";
            break;

        case 'week':
            $query = "SELECT * FROM sensor WHERE created_at >= NOW() - INTERVAL 7 DAY ORDER BY id ASC";
            break;

        case 'month':
            $query = "SELECT * FROM sensor WHERE created_at >= NOW() - INTERVAL 30 DAY ORDER BY id ASC";
            break;

        case 'year':
            $query = "SELECT * FROM sensor WHERE created_at >= NOW() - INTERVAL 1 YEAR ORDER BY id ASC";
            break;

        case 'all':
            $query = "SELECT * FROM sensor ORDER BY id ASC";
            break;

        default:
            $query = "SELECT * FROM ( SELECT * FROM sensor ORDER BY id DESC LIMIT 1000 ) sub ORDER BY id ASC";
            break;
    }

    $result = DB::select($query);
    $soil = array();
    $extenso = array();
    $gyroX = array();
    $gyroY = array();
    $waterLevel = array();
    foreach ($result as $row) {
        array_push($soil, [
            "x" => $row->id,
            "y" => $row->s,
            "time" => $row->created_at,
        ]);
        array_push($extenso, [
            "x" => $row->id,
            "y" => $row->e,
            "time" => $row->created_at,
        ]);
        array_push($gyroX, [
            "x" => $row->id,
            "y" => $row->x,
            "time" => $row->created_at,
        ]);
        array_push($gyroY, [
            "x" => $row->id,
            "y" => $row->y,
            "time" => $row->created_at,
        ]);
        array_push($waterLevel, [
            "x" => $row->id,
            "y" => $row->wl,
            "time" => $row->created_at,
        ]);
    }

    $final_result = [
        "soil" => $soil,
        "extenso" => $extenso,
        "gyro" => [
            "x" => $gyroX,
            "y" => $gyroY,
        ],
        "waterlevel" => $waterLevel
    ];

    return response()->json($final_result)->setEncodingOptions(JSON_NUMERIC_CHECK);
});

/**
 * GET - /latest_data
 * Getting the sensor latest uploaded data
 */
Route::get('/latest_data', function () {
    $result = DB::table('sensor')->orderBy('id', 'desc')->first();
    $final_result = [
        "id" => $result->id,
        "soil" => $result->s,
        "soil_str" => $result->s . "%",
        "extenso" => $result->e,
        "extenso_str" => $result->e . " cm",
        "gyro" => [
            "x" => $result->x,
            "x_str" => $result->x . "°",
            "y" => $result->y,
            "y_str" => $result->y . "°",
        ],
        "gyro_str" => "x: " . $result->x . "°; y: " . $result->y . "°",
        "waterlevel" => $result->wl,
        "waterlevel_str" => $result->wl . " cm",
        "created_at" => $result->created_at
    ];

    return json_encode($final_result);
});

/**
 * POST - /v1/hw
 * This endpoint only consume by the EWS, to upload the data
 * 
 * Body:
 * 1. s - float
 * 2. e - float
 * 3. x - float
 * 4. y - float
 * 5. z - float
 * 6. wl - float (default = 0)
 */
Route::post('/v1/hw', function (Request $request) {
    $result = Sensor::create([
        "s" => $request->input('s'),
        "e" => $request->input('e'),
        "x" => $request->input('x'),
        "y" => $request->input('y'),
        "z" => $request->input('z'),
        "wl" => is_null($request->input('wl')) ? 0 : $request->input('wl'),
    ]);
    if (!$result) return response()->json(["message" => "Gagal menambahkan data"], 500);

    return response()->json(["message" => "Data berhasil ditambahkan"], 201);
});

/**
 * GET - /v1/trg
 * This endpoint only consume by the EWS, to process the trigger data
 */
Route::get('/v1/trg', function () {
    $result = DB::selectOne("SELECT * FROM `trigger` WHERE id = 1");
    $final_result = [
        "id" => $result->id,
        "s" => $result->s,
        "e" => $result->e,
        "x" => $result->x,
        "y" => $result->y,
        "wl" => $result->wl,
        "allow" => $result->active,
        "time" => $result->time
    ];

    return json_encode($final_result);
});
