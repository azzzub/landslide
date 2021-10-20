<?php

/** @var \Laravel\Lumen\Routing\Router $router */

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

/**
 * Getting the API status
 */
$router->get('/', function () {
    return [
        "status_code" => 200,
        "message" => "OK"
    ];
});

$router->post('/register', 'UserController@register');
$router->post('/login', 'UserController@login');
$router->post('/session', 'UserController@session');
$router->get('/trigger', 'SettingController@getTrigger');
$router->put('/trigger', 'SettingController@updateTrigger');

/**
 * PUBLIC API
 */

/**
 * GET - /data[/time]
 * Getting the sensor data based on the time
 * 
 * Time:
 * 1. day
 * 2. week
 * 3. month
 * 4. year
 * 5. *empty* (all data)
 */
$router->get('/data[/{time}]', function ($time = 'year') {
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

        default:
            $query = "SELECT * FROM sensor ORDER BY id ASC";
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
            "created_at" => $row->created_at,
        ]);
    }
    return $final_result;
});

/**
 * GET - /latest_data
 * Getting the sensor latest uploaded data
 */
$router->get('/latest_data', function () {
    $result = DB::selectOne("SELECT * FROM sensor WHERE id = (SELECT max(id) FROM sensor)");
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
 */
$router->post('/v1/hw', function (Request $request) {
    $result = DB::table("sensor")->insert([
        "s" => $request->input('s'),
        "e" => $request->input('e'),
        "x" => $request->input('x'),
        "y" => $request->input('y'),
        "z" => $request->input('z'),
        "created_at" => new DateTime(),
        "updated_at" => new DateTime(),
    ]);
    if (!$result) return response()->json(["message" => "Gagal menambahkan data"], 500);

    return response()->json(["message" => "Data berhasil ditambahkan"], 201);
});

/**
 * GET - /v1/trg
 * This endpoint only consume by the EWS, to process the trigger data
 */
$router->get('/v1/trg', function () {
    $result = DB::selectOne("SELECT * FROM `trigger` WHERE id = 1");
    $final_result = [
        "id" => $result->id,
        "s" => $result->s,
        "e" => $result->e,
        "x" => $result->x,
        "y" => $result->y,
        "allow" => $result->active,
        "time" => $result->time
    ];

    return json_encode($final_result);
});
