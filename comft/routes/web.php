<?php

/** @var \Laravel\Lumen\Routing\Router $router */

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

$router->get('/data', function () {
    $result = DB::select("SELECT * FROM sensor ORDER BY id ASC");
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
