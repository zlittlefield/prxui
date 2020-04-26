#include "prx/helpers/json.hh"
#include "prx/helpers/ws_client.hh"

#include <chrono>
#include <iostream>
#include <string>

using ws_client::WebSocket;

nlohmann::json create_box(std::string name)
{
    nlohmann::json j1 = {{"name", name}, {"type", "box"}, {"dims", {1, 1, 1}}, {"color", "blue"}};
    return j1;
}

nlohmann::json create_sphere(std::string name)
{
    nlohmann::json j1 = {{"name", name}, {"type", "sphere"}, {"radius", 2}, {"color", "red"}};
    return j1;
}

nlohmann::json create_pose(
  std::string name, double x, double y, double z, double qx, double qy, double qz, double qw)
{
    nlohmann::json j1 = {
      {"name", name}, {"position", {x, y, z}}, {"orientation", {qx, qy, qz, qw}}};
    return j1;
}

int main()
{
    nlohmann::json position_update;
    position_update["new_geoms"] = {};
    position_update["new_geoms"].push_back(create_box("box1"));
    position_update["new_geoms"].push_back(create_sphere("ball1"));

    double radius = 5;

    double b1 = 0, b2 = 0, b3 = 4, b4 = 0, b5 = 0, b6 = 0, b7 = 1;
    double s1 = radius, s2 = 0, s3 = 4, s4 = 0, s5 = 0, s6 = 0, s7 = 1;

    std::unique_ptr<WebSocket> ws(WebSocket::from_url("ws://localhost:9999/prx"));

    bool paused = false;

    const auto send_info = [&ws](auto &json_msg) {
        auto message = nlohmann::json::to_bson(json_msg);
        ws->poll();
        ws->sendBinary(message);
        json_msg.clear();
    };

    const auto handle_message = [&paused](const auto data) {
        auto js_input = nlohmann::json::from_bson(data);
        if (js_input["paused"] != paused)
        {
            paused = js_input["paused"];
        }
    };

    const auto receive_info = [&handle_message, &ws]() {
        ws->poll();
        ws->dispatchBinary(handle_message);
    };

    double current_theta = 0;
    double delta         = 0.1;
    double delta_ms      = 40;
    double elapsed_ms    = delta_ms;

    auto end_loop_time   = std::chrono::system_clock::now();
    auto start_loop_time = std::chrono::system_clock::now();

    while (true)
    {
        start_loop_time = std::chrono::system_clock::now();
        receive_info();
        if (!paused)
        {
            if (elapsed_ms >= delta_ms)
            {
                elapsed_ms -= delta_ms;
                b6 = sin(current_theta / 2);
                b7 = cos(current_theta / 2);

                s1 = radius * cos(current_theta);
                s2 = radius * sin(current_theta);

                position_update["geom_poses"] = {};
                position_update["geom_poses"].push_back(
                  create_pose("box1", b1, b2, b3, b4, b5, b6, b7));
                position_update["geom_poses"].push_back(
                  create_pose("ball1", s1, s2, s3, s4, s5, s6, s7));
                send_info(position_update);

                // update state
                current_theta += delta;
            }
            end_loop_time = std::chrono::system_clock::now();
            elapsed_ms +=
              std::chrono::duration<double>(end_loop_time - start_loop_time).count() * 1000;
        }
    }

    return 0;
}